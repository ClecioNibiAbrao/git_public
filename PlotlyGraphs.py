import numpy as np
import plotly.graph_objects as go
import plotly.offline as pyo



################################# SCATTER PLOT #################################

def scatter_plot():
    # Scatter plot
    np.random.seed(42)
    random_x = np.random.randint(1, 101, 100)
    random_y = np.random.randint(1, 101, 100)

    data = [go.Scatter(
        x=random_x,
        y=random_y,
        mode='markers',
        marker=dict(
            size=12,
            color='rgb(51,204,153)',
            symbol='pentagon',
            line={'width': 2}
        )
    )]

    layout = go.Layout(
        title='Hello First Plot',
        xaxis={'title': 'My X axis'},
        yaxis=dict(title="My Y axis"),
        hovermode='closest'
    )

    fig = go.Figure(data=data, layout=layout)
    pyo.plot(fig, filename='scatter.html')



################################# LINE CHART #################################


def line_chart():
    # Line chart
    np.random.seed(56)
    x_values = np.linspace(0, 1, 100)
    y_values = np.random.randn(100)

    trace0 = go.Scatter(x=x_values, y=y_values+5, mode='markers', name='markers')
    trace1 = go.Scatter(x=x_values, y=y_values, mode='lines', name='mylines')
    trace2 = go.Scatter(x=x_values, y=y_values-5, mode='lines+markers', name='my favorite')

    data = [trace0,trace1,trace2]
    layout = go.Layout(title='LINE')

    fig = go.Figure(data=data, layout=layout)
    pyo.plot(fig, filename='line_chart.html')


def plot_all():
    # Chama as funções para gerar ambos os gráficos
    scatter_plot()
    line_chart()

# Exemplo de uso:
plot_all()
