import {color} from 'd3-color';
import React from 'react';
import LiquidFillGauge from 'react-liquid-gauge';
import {render} from "react-dom";

interface IDispenserProps {
    // id: string;
    // dataHora: string;
    // dispositivo: string;
    nivel: number;
    // wifi: number;
    // voltagem: number;
    // localidade: string;
}

export default function Dispenser(props: IDispenserProps) {
    // const {id, dataHora, dispositivo, nivel, wifi, voltagem, localidade} = props;
    let {nivel} = props;

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
        case (nivel >= 0 && nivel <= 15):
            fillColor = vermelho;
            break;
        case (nivel >= 16 && nivel <= 25):
            fillColor = laranja;
            break;
        case (nivel >= 26 && nivel <= 40):
            fillColor = amarelo;
            break;
        case (nivel >= 41 && nivel <= 100):
            fillColor = verde;
            break;
        default: fillColor = preto;
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
        </div>
    );
}
