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
import React, {useEffect, useState} from 'react';
import LayoutWithMenu from '../../components/layout/LayoutWithMenu/LayoutWithMenu';
import {NextPageContext} from 'next';
import {Dashboard} from '../../lib/Dashboard';
import fetch from "isomorphic-unfetch";
import {red} from '@material-ui/core/colors';
import Grid from '@material-ui/core/Grid';
import Dispenser from "../../components/screen/Dispenser/Dispenser";

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

export default function ListaDashboards({dashboards}: any) {
    const classes = useStyles();
    const [rows, setRows] = useState([]);

    useEffect(() => {
        if (dashboards) {
            setRows(dashboards);
        } else {
            [];
        }
    }, []);

    return (
        <LayoutWithMenu>
            <Grid item xs={12}>
                <Typography component='h1' variant='h4'>
                    Dashboards
                </Typography>
            </Grid>
            <Grid container spacing={3}>
                {rows.map((row) => (
                    <Grid item xs={3} key={row.id}>
                        <Dispenser
                            id={row.dispositivoId}
                            dataHora={row.dataHora}
                            dispositivo={row.dispositivo.dispositivo}
                            nivel={row.nivel}
                            wifi={row.wifi}
                            voltagem={row.voltagem}
                            localidade={row.dispositivo.localidade}
                        ></Dispenser>
                    </Grid>
                ))}
            </Grid>
        </LayoutWithMenu>
    );
}

ListaDashboards.getInitialProps = async (ctx: NextPageContext) => {
    let url = !process.env.BASE_URL ? '/api/dashboards' : `${process.env.BASE_URL}/api/dashboards`;
    const resp = await fetch(url);
    const res = await resp.json();


    console.log(`Dashboard:\n${JSON.stringify(res)}`);

    const json: Dashboard[] = res.dashboards;
    return {
        dashboards: json
    };
}
