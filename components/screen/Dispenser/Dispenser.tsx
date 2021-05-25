import {color} from 'd3-color';
import LiquidFillGauge from 'react-liquid-gauge';
import {
    Avatar,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    createStyles,
    makeStyles,
    Theme,
    Typography,
} from '@material-ui/core';
import React from 'react';
import {red} from '@material-ui/core/colors';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        toolbar: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        root: {
            maxWidth: 260,
            flexGrow: 1
        },
        media: {
            height: 0,
            paddingTop: '56.25%', // 16:9
        },
        expand: {
            transform: 'rotate(0deg)',
            marginLeft: 'auto',
            transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.shortest,
            }),
        },
        expandOpen: {
            transform: 'rotate(180deg)',
        },
        avatar: {
            backgroundColor: red[500],
        },
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary,
        }
    }),
);

interface IDispenserProps {
    id: string;
    dataHora: Date;
    dispositivo: string;
    nivel: number;
    wifi: number;
    voltagem: number;
    localidade: string;
}

export default function Dispenser(props: IDispenserProps) {
    let {id, dataHora, dispositivo, nivel, wifi, voltagem, localidade} = props;
    const classes = useStyles();
    let status = '';
    // dataHora = dataHora.replace('T', '').replace('Z', '');
    let data = new Date(dataHora);
    let dataFormatada = ((data.getDate() )) + "/" + ((data.getMonth() + 1)) + "/" + data.getFullYear() + " " +
        data.getHours() + ":" + data.getMinutes() + ":" + data.getSeconds();

    if (nivel < 0 || nivel > 100) nivel = -99;

    //Paleta de Cores de estatus
    const preto     = '#000000';
    const verde     = '#53c222';
    const amarelo   = '#d9d002';
    const laranja   = '#dc8602';
    const vermelho  = '#ff0000';

    //verificando a cor do nivel
    let fillColor = verde;
    switch (true) {
        case (nivel >= 0 && nivel <= 15.99):
            fillColor = vermelho;
            status = 'Substituir';
            break;
        case (nivel >= 16 && nivel <= 25.99):
            fillColor = laranja;
            status = 'Crítico';
            break;
        case (nivel >= 26 && nivel <= 40.99):
            fillColor = amarelo;
            status = 'Atenção';
            break;
        case (nivel >= 41 && nivel <= 100):
            fillColor = verde;
            status = 'Normal';
            break;
        default: {
            fillColor = preto;
            status = 'Sem Comunicação';
        }
    }

    const radius = 60;  //tamanho do círculo
    const gradientStops = [
        {
            key: '0%',
            stopColor: color(fillColor).darker(0.5).toString(),
            stopOpacity: 1,
            offset: '0%'
        },
        {
            key: '50%',
            stopColor: fillColor,
            stopOpacity: 0.75,
            offset: '50%'
        },
        {
            key: '100%',
            stopColor: color(fillColor).brighter(0.5).toString(),
            stopOpacity: 0.5,
            offset: '100%'
        }
    ];

    return (
        <div>
            <Card className={classes.root}>
                <CardHeader
                    avatar={
                        <Avatar aria-label="recipe" className={classes.avatar}>
                            {String(id).padStart(2, '0')}
                        </Avatar>
                    }
                    title={dispositivo}
                    subheader={dataFormatada}
                />
                <LiquidFillGauge
                    style={{margin: '0 auto'}}
                    width={radius * 2}
                    height={radius * 2}
                    value={nivel}
                    percent="%"
                    textSize={1}
                    textOffsetX={0}
                    textOffsetY={0}
                    textRenderer={(props) => {
                        const value = Math.round(props.value);
                        const radius = Math.min(props.height / 2, props.width / 2);
                        const textPixels = (props.textSize * radius / 2);
                        const valueStyle = {
                            fontSize: textPixels
                        };
                        const percentStyle = {
                            fontSize: textPixels * 0.6
                        };

                        return (
                            <tspan>
                                <tspan className="value" style={valueStyle}>{value}</tspan>
                                <tspan style={percentStyle}>{props.percent}</tspan>
                            </tspan>
                        );
                    }}
                    riseAnimation={true}
                    waveAnimation={true}
                    waveFrequency={2}
                    waveAmplitude={1}
                    gradient={true}
                    gradientStops={gradientStops}
                    circleStyle={{
                        fill: fillColor
                    }}
                    waveStyle={{
                        fill: fillColor
                    }}
                    textStyle={{
                        fill: color('#444').toString(),
                        fontFamily: 'Arial'
                    }}
                    waveTextStyle={{
                        fill: color('#fff').toString(),
                        fontFamily: 'Arial'
                    }}
                    // onClick={() => {
                    //     this.setState({value: Math.random() * 100});
                    // }}
                />
                <div
                    style={{
                        margin: '20px auto',
                        width: 120
                    }}
                >
                </div>
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p" align="center">
                        {status}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                    <CardContent>
                        <Typography variant="body2" color="textSecondary" component="p">
                            {localidade}
                        </Typography>
                    </CardContent>
                </CardActions>
            </Card>
        </div>
    );
}
