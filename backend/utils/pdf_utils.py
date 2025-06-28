from reportlab.lib import colors
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
import os
import logging
from datetime import datetime
from typing import List, Dict, Any, Optional
import matplotlib.pyplot as plt
import seaborn as sns
import io
import base64

logger = logging.getLogger(__name__)

class PDFUtils:
    def __init__(self):
        """Initialize PDF utilities"""
        self.output_dir = os.getenv('PDF_OUTPUT_DIR', 'reports')
        self.ensure_output_directory()
        
    def ensure_output_directory(self):
        """Ensure output directory exists"""
        if not os.path.exists(self.output_dir):
            os.makedirs(self.output_dir)
    
    def generate_feedback_report(self, product_id: str, feedback_list: List[Dict], 
                               analysis: Dict[str, Any]) -> str:
        """
        Generate PDF report for product feedback
        
        Args:
            product_id (str): Product ID
            feedback_list (List[Dict]): List of feedback entries
            analysis (Dict[str, Any]): Feedback analysis results
            
        Returns:
            str: Path to generated PDF file
        """
        try:
            # Create filename
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"feedback_report_{product_id}_{timestamp}.pdf"
            filepath = os.path.join(self.output_dir, filename)
            
            # Create PDF document
            doc = SimpleDocTemplate(filepath, pagesize=A4)
            story = []
            
            # Get styles
            styles = getSampleStyleSheet()
            title_style = ParagraphStyle(
                'CustomTitle',
                parent=styles['Heading1'],
                fontSize=24,
                spaceAfter=30,
                alignment=TA_CENTER,
                textColor=colors.darkblue
            )
            
            # Add title
            title = Paragraph(f"Feedback Report - Product {product_id}", title_style)
            story.append(title)
            story.append(Spacer(1, 20))
            
            # Add report metadata
            report_info = [
                ['Report Generated:', datetime.now().strftime("%Y-%m-%d %H:%M:%S")],
                ['Product ID:', product_id],
                ['Total Reviews:', str(analysis.get('total_reviews', 0))],
                ['Average Rating:', f"{analysis.get('average_rating', 0):.2f}/5.0"]
            ]
            
            info_table = Table(report_info, colWidths=[2*inch, 3*inch])
            info_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, -1), colors.lightgrey),
                ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 12),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
                ('GRID', (0, 0), (-1, -1), 1, colors.black)
            ]))
            
            story.append(info_table)
            story.append(Spacer(1, 30))
            
            # Add sentiment analysis
            if 'sentiment_analysis' in analysis:
                sentiment_data = analysis['sentiment_analysis']
                story.append(Paragraph("Sentiment Analysis", styles['Heading2']))
                
                sentiment_table_data = [
                    ['Sentiment', 'Count', 'Percentage'],
                    ['Positive', str(sentiment_data.get('positive', 0)), 
                     f"{(sentiment_data.get('positive', 0) / max(1, analysis.get('total_reviews', 1)) * 100):.1f}%"],
                    ['Negative', str(sentiment_data.get('negative', 0)), 
                     f"{(sentiment_data.get('negative', 0) / max(1, analysis.get('total_reviews', 1)) * 100):.1f}%"],
                    ['Neutral', str(sentiment_data.get('neutral', 0)), 
                     f"{(sentiment_data.get('neutral', 0) / max(1, analysis.get('total_reviews', 1)) * 100):.1f}%"]
                ]
                
                sentiment_table = Table(sentiment_table_data, colWidths=[2*inch, 1*inch, 1.5*inch])
                sentiment_table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                    ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                    ('FONTSIZE', (0, 0), (-1, -1), 10),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
                    ('GRID', (0, 0), (-1, -1), 1, colors.black)
                ]))
                
                story.append(sentiment_table)
                story.append(Spacer(1, 20))
            
            # Add key themes
            if 'key_themes' in analysis and analysis['key_themes']:
                story.append(Paragraph("Key Themes", styles['Heading2']))
                themes_text = ", ".join(analysis['key_themes'])
                story.append(Paragraph(themes_text, styles['Normal']))
                story.append(Spacer(1, 20))
            
            # Add recommendations
            if 'recommendations' in analysis and analysis['recommendations']:
                story.append(Paragraph("Recommendations", styles['Heading2']))
                for i, recommendation in enumerate(analysis['recommendations'], 1):
                    story.append(Paragraph(f"{i}. {recommendation}", styles['Normal']))
                story.append(Spacer(1, 20))
            
            # Add recent feedback (last 10 entries)
            if feedback_list:
                story.append(Paragraph("Recent Feedback", styles['Heading2']))
                
                # Prepare feedback data for table
                feedback_data = [['Date', 'Rating', 'Comment']]
                
                for feedback in feedback_list[:10]:  # Show last 10 feedbacks
                    date = feedback.get('timestamp', '')
                    if date:
                        try:
                            date = datetime.fromisoformat(date.replace('Z', '+00:00')).strftime('%Y-%m-%d')
                        except:
                            date = date[:10]  # Fallback to first 10 characters
                    
                    rating = f"{feedback.get('rating', 0)}/5"
                    comment = feedback.get('comment', '')[:100]  # Truncate long comments
                    if len(feedback.get('comment', '')) > 100:
                        comment += "..."
                    
                    feedback_data.append([date, rating, comment])
                
                feedback_table = Table(feedback_data, colWidths=[1.5*inch, 1*inch, 4*inch])
                feedback_table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                    ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                    ('FONTSIZE', (0, 0), (-1, -1), 9),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
                    ('GRID', (0, 0), (-1, -1), 1, colors.black),
                    ('VALIGN', (0, 0), (-1, -1), 'TOP')
                ]))
                
                story.append(feedback_table)
            
            # Build PDF
            doc.build(story)
            
            logger.info(f"Feedback report generated: {filepath}")
            return filepath
            
        except Exception as e:
            logger.error(f"Error generating feedback report: {str(e)}")
            raise
    
    def generate_product_report(self, product_data: Dict[str, Any]) -> str:
        """
        Generate PDF report for product details
        
        Args:
            product_data (Dict[str, Any]): Product information
            
        Returns:
            str: Path to generated PDF file
        """
        try:
            product_id = product_data.get('id', 'unknown')
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"product_report_{product_id}_{timestamp}.pdf"
            filepath = os.path.join(self.output_dir, filename)
            
            # Create PDF document
            doc = SimpleDocTemplate(filepath, pagesize=A4)
            story = []
            
            # Get styles
            styles = getSampleStyleSheet()
            title_style = ParagraphStyle(
                'CustomTitle',
                parent=styles['Heading1'],
                fontSize=20,
                spaceAfter=20,
                alignment=TA_CENTER,
                textColor=colors.darkblue
            )
            
            # Add title
            title = Paragraph(f"Product Report - {product_data.get('name', 'Unknown Product')}", title_style)
            story.append(title)
            story.append(Spacer(1, 20))
            
            # Add product details
            product_info = [
                ['Product ID:', product_data.get('id', 'N/A')],
                ['Name:', product_data.get('name', 'N/A')],
                ['Category:', product_data.get('category', 'N/A')],
                ['Price:', f"${product_data.get('price', 0):.2f}"],
                ['Brand:', product_data.get('brand', 'N/A')],
                ['Stock Quantity:', str(product_data.get('stock_quantity', 0))],
                ['Rating:', f"{product_data.get('rating', 0):.2f}/5.0"],
                ['Review Count:', str(product_data.get('review_count', 0))],
                ['Created Date:', product_data.get('created_at', 'N/A')[:10]]
            ]
            
            info_table = Table(product_info, colWidths=[2*inch, 4*inch])
            info_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (0, -1), colors.lightgrey),
                ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 11),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
                ('GRID', (0, 0), (-1, -1), 1, colors.black)
            ]))
            
            story.append(info_table)
            story.append(Spacer(1, 20))
            
            # Add description
            if product_data.get('description'):
                story.append(Paragraph("Description", styles['Heading2']))
                story.append(Paragraph(product_data['description'], styles['Normal']))
                story.append(Spacer(1, 20))
            
            # Add tags
            if product_data.get('tags'):
                story.append(Paragraph("Tags", styles['Heading2']))
                tags_text = ", ".join(product_data['tags'])
                story.append(Paragraph(tags_text, styles['Normal']))
            
            # Build PDF
            doc.build(story)
            
            logger.info(f"Product report generated: {filepath}")
            return filepath
            
        except Exception as e:
            logger.error(f"Error generating product report: {str(e)}")
            raise
    
    def generate_sales_report(self, sales_data: List[Dict[str, Any]], 
                            date_range: Dict[str, str]) -> str:
        """
        Generate PDF sales report
        
        Args:
            sales_data (List[Dict[str, Any]]): Sales data
            date_range (Dict[str, str]): Date range for the report
            
        Returns:
            str: Path to generated PDF file
        """
        try:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"sales_report_{timestamp}.pdf"
            filepath = os.path.join(self.output_dir, filename)
            
            # Create PDF document
            doc = SimpleDocTemplate(filepath, pagesize=A4)
            story = []
            
            # Get styles
            styles = getSampleStyleSheet()
            
            # Add title
            title = Paragraph("Sales Report", styles['Title'])
            story.append(title)
            story.append(Spacer(1, 20))
            
            # Add date range
            date_info = f"Period: {date_range.get('start_date', 'N/A')} to {date_range.get('end_date', 'N/A')}"
            story.append(Paragraph(date_info, styles['Normal']))
            story.append(Spacer(1, 20))
            
            # Add sales summary
            if sales_data:
                total_sales = sum(item.get('amount', 0) for item in sales_data)
                total_orders = len(sales_data)
                avg_order = total_sales / max(1, total_orders)
                
                summary_data = [
                    ['Total Orders:', str(total_orders)],
                    ['Total Sales:', f"${total_sales:.2f}"],
                    ['Average Order Value:', f"${avg_order:.2f}"]
                ]
                
                summary_table = Table(summary_data, colWidths=[2*inch, 2*inch])
                summary_table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, -1), colors.lightblue),
                    ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
                    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                    ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
                    ('FONTSIZE', (0, 0), (-1, -1), 12),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
                    ('GRID', (0, 0), (-1, -1), 1, colors.black)
                ]))
                
                story.append(summary_table)
                story.append(Spacer(1, 30))
                
                # Add detailed sales data
                story.append(Paragraph("Detailed Sales Data", styles['Heading2']))
                
                sales_table_data = [['Date', 'Product', 'Quantity', 'Amount']]
                
                for sale in sales_data[:50]:  # Show first 50 entries
                    date = sale.get('date', 'N/A')[:10]
                    product = sale.get('product_name', 'N/A')[:30]
                    quantity = str(sale.get('quantity', 0))
                    amount = f"${sale.get('amount', 0):.2f}"
                    
                    sales_table_data.append([date, product, quantity, amount])
                
                sales_table = Table(sales_table_data, colWidths=[1.5*inch, 3*inch, 1*inch, 1.5*inch])
                sales_table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                    ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                    ('FONTSIZE', (0, 0), (-1, -1), 9),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
                    ('GRID', (0, 0), (-1, -1), 1, colors.black)
                ]))
                
                story.append(sales_table)
            
            # Build PDF
            doc.build(story)
            
            logger.info(f"Sales report generated: {filepath}")
            return filepath
            
        except Exception as e:
            logger.error(f"Error generating sales report: {str(e)}")
            raise
    
    def create_chart_image(self, data: Dict[str, Any], chart_type: str = 'bar') -> Optional[str]:
        """
        Create chart image for inclusion in PDF reports
        
        Args:
            data (Dict[str, Any]): Chart data
            chart_type (str): Type of chart ('bar', 'pie', 'line')
            
        Returns:
            Optional[str]: Path to chart image file
        """
        try:
            plt.figure(figsize=(8, 6))
            
            if chart_type == 'bar':
                plt.bar(data.keys(), data.values())
                plt.xlabel('Categories')
                plt.ylabel('Values')
            elif chart_type == 'pie':
                plt.pie(data.values(), labels=data.keys(), autopct='%1.1f%%')
            elif chart_type == 'line':
                plt.plot(list(data.keys()), list(data.values()))
                plt.xlabel('X-axis')
                plt.ylabel('Y-axis')
            
            # Save chart
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            chart_filename = f"chart_{chart_type}_{timestamp}.png"
            chart_path = os.path.join(self.output_dir, chart_filename)
            
            plt.savefig(chart_path, dpi=300, bbox_inches='tight')
            plt.close()
            
            return chart_path
            
        except Exception as e:
            logger.error(f"Error creating chart: {str(e)}")
            return None
