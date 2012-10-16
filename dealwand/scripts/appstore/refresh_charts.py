from backend.appstore import *
from model.apps import app, appChart
import logging

def main():
    charts = appChart.all().fetch(100)
    
    i = 0
    for chart in charts:
        index_chart_task(chart.name)
        i += 1
    
    return 'Added all %s charts to refresh queue'%i