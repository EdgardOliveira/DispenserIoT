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
import {getCookies} from "../../lib/RESTClient";

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
                        <Card className={classes.root}>
                            <CardHeader
                                avatar={
                                    <Avatar aria-label="recipe" className={classes.avatar}>
                                        {row.dispositivoId}
                                    </Avatar>
                                }
                                title="Dispenser IoT"
                                subheader={String(row.dataHora)}
                            />
                            <Dispenser nivel={row.nivel}></Dispenser>
                            <CardContent>
                                <Typography variant="body2" color="textSecondary" component="p" align="center">
                                    Normal
                                </Typography>
                            </CardContent>
                            <CardActions disableSpacing>
                                <CardContent>
                                    <Typography variant="body2" color="textSecondary" component="p">
                                        Entrada 1 - Constantino Nery
                                    </Typography>
                                </CardContent>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </LayoutWithMenu>
    );
}

ListaDashboards.getInitialProps = async (ctx: NextPageContext) => {

    // let url;
    // if (!process.env.BASE_URL)
    //     url = '/api/dashboards';
    // else
    //     url = `${process.env.BASE_URL}/api/dashboards`;
    //
    // const res = await getCookies(url, ctx);

    let BASE_URL;
    if (process.env.NODE_ENV === "development")
        BASE_URL = 'http://localhost:3000/api/dashboards';
    else
       BASE_URL = 'https://iotmonitor.vercel.app/api/dashboards';

    const resp = await fetch(BASE_URL);

    const res = await resp.json();
    const json: Dashboard[] = res.dashboards;
    return {
        dashboards: json
    };
}
