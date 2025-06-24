from dash import Dash, html, dcc, callback, Output, Input
import plotly.express as px
import pandas as pd



app = Dash()
app.layout = html.Div(
    html.Div([
        html.H1('ROSE DATA'),
        html.Div(id='live-update-text'),
        dcc.Graph(id='live-update-graph'),
        dcc.Interval(
            id='interval-component',
            interval=1*1000, # in milliseconds
            n_intervals=0
        )
    ])
)


def initDashUI():
    # Requires Dash 2.17.0 or later
    #app.layout = [html.Div(children='Hello World')]
    app.run(debug=True)


@callback(Output('live-update-text', 'children'), 
          Input('interval-component', 'n_intervals'))
def update_num(n):
    return html.Span(str(n))