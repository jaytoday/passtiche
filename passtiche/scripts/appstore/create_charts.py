from model.apps import appChart
import logging

def main():
    itunes_urls = {
        'top_all_paid' : 'http://itunes.apple.com/WebObjects/MZStore.woa/wa/viewTop?genreId=36&id=25204&popId=30',
        'top_all_free' : 'http://itunes.apple.com/WebObjects/MZStore.woa/wa/viewTop?genreId=36&id=25204&popId=27',
        'top_all_grossing' : 'http://itunes.apple.com/WebObjects/MZStore.woa/wa/viewTop?genreId=36&id=25204&popId=38'
    }
    
    itunes_descriptions = {
        'top_all_paid' : 'Top Paid iPhone Apps (US)',
        'top_all_free' : 'Top Free iPhone Apps (US)',
        'top_all_grossing' : 'Top Grossing iPhone Apps (US)'
    }

    for chart_name, chart_url in itunes_urls.iteritems():
        chart = appChart.all().filter('name',chart_name).get()
        if not chart:
            logging.info("Creating new chart (%s)"%chart_name)
            chart = appChart(key_name=chart_name, name=chart_name, url=chart_url)
            chart.put()
    
    for chart_name, chart_description in itunes_descriptions.iteritems():
        chart = appChart.all().filter('name',chart_name).get()
        if not chart:
            logging.info("Chart not found (%s)"%chart_name)
        if chart:
            if not chart.description or (chart.description and chart.description is not chart_description):
                logging.info("Adding chart description (%s)"%chart_name)
                chart.description = chart_description
                chart.put()
    return 'All charts created'
