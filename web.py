from dash import Dash, html, dcc, callback, Output, Input
import plotly.express as px
import pandas as pd
import can
from message_parser import canData, bmsFaults
from xbee_interface import log_queue

app = Dash()
app.layout = html.Div([
    html.Div([
        html.Img(src="assets/logo.png", width=250),
        html.H1("ROSE Data")
        # status?
        # xbee status?
    ], id='header'),

    html.Div([html.H3("Strategems"), html.Div(id="strategy-container")], id='strategy'),
    html.Div([html.H3("Score"), html.Div(id="score-container")], id='score'),
    html.Div([html.H3("Data"), html.Div(id="extra-container")], id='extra'),

    html.Div([
        dcc.Tabs(id="graph-tabs", value='speed-graph', children=[
            dcc.Tab(label='Speed', value='speed-graph'),
            dcc.Tab(label='SoC', value='soc-graph'),
            dcc.Tab(label='Amps Out', value='amps-graph'),
            dcc.Tab(label='Solar In', value='solar-graph')
        ]),
        html.Div(id='graph-tabs-content')
    ], id='graphs'),

    html.Div([html.H3("Live CAN"), html.Div(id="hex-container")], id='hex'),
    dcc.Interval(
        id='interval-component',
        interval=250, # in milliseconds
        n_intervals=0
    )
], className="dashMain")

# example
#@callback(Output('live-update-text', 'children'), 
          #Input('interval-component', 'n_intervals'))
def update_num(n):
    return html.Span(str(n))

@callback(Output('graph-tabs-content', 'children'), 
          Input('graph-tabs', 'value'))
def render_graph(tab):
    if tab == 'speed-graph':
        return html.Div([
            html.H3('SPEED'),
            dcc.Graph(
                figure={
                    'data': [{
                        'x': [1, 2, 3],
                        'y': [3, 1, 2],
                        'type': 'bar'
                    }]
                }
            )
        ])
    elif tab == 'soc-graph':
        return html.Div([
            html.H3('SoC'),
            dcc.Graph(
                figure={
                    'data': [{
                        'x': [1, 2, 3],
                        'y': [3, 1, 2],
                        'type': 'bar'
                    }]
                }
            )
        ])
    elif tab == 'amps-graph':
        return html.Div([
            html.H3('AMPS'),
            dcc.Graph(
                figure={
                    'data': [{
                        'x': [1, 2, 3],
                        'y': [3, 1, 2],
                        'type': 'bar'
                    }]
                }
            )
        ])
    elif tab == 'solar-graph':
        return html.Div([
            html.H3('SOLAR'),
            dcc.Graph(
                figure={
                    'data': [{
                        'x': [1, 2, 3],
                        'y': [3, 1, 2],
                        'type': 'bar'
                    }]
                }
            )
        ])

# log of five most recent messages
@callback(Output('hex-container', 'children'),
          Input('interval-component', 'n_intervals'))
def update_log(n):
    return log_queue

@callback(Output('extra-container', 'children'),
          Input('interval-component', 'n_intervals'))
def update_current_values(n):
    return html.Table([
        html.Tr([html.Td("Current (A)"), html.Td(str(canData['PackCurrent']))]),
        html.Tr([html.Td("SoC (%)"), html.Td(str(canData['SOC']))]),
        html.Tr([html.Td("Speed"), html.Td(str(canData["Speed"]))])
    ])