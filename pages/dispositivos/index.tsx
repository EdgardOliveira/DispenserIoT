import {
    Button,
    createStyles,
    IconButton,
    makeStyles,
    Paper,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Theme,
    Typography,
} from '@material-ui/core';
import { Add, AddCircle, AddCircleOutline, Delete, DeleteForever, Edit, Wifi, WifiOff } from '@material-ui/icons';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import LayoutWithMenu from '../../components/layout/LayoutWithMenu/LayoutWithMenu';
import ConfirmationDialog from '../../components/screen/ConfirmationDialog/ConfirmationDialog';
import { NextPageContext } from 'next';
import { excluirDados, getCookies } from '../../lib/RESTClient';
import { Dispositivo } from '../../lib/Dispositivo';
import fetch from 'isomorphic-unfetch';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        toolbar: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        table: {
            marginTop: theme.spacing(3),
        },
    }),
);

export default function ListaDispositivos({dispositivos} : any) {
    const classes = useStyles();
    const [rows, setRows] = useState([]);

    const [deleteOptions, setDeleteOptions] = useState<{
        show: boolean;
        itemId?: number;
        itemDescription?: string;
    }>({ show: false });

    const [messageInfo, setMessageInfo] = useState<{
        show: boolean;
        message: string;
    }>({ show: false, message: '' });

    async function excluir(id:number){
        try {
            const resposta = await excluirDados('/api/dispositivos', id)

            if (resposta.sucesso === true) {
                //TODO confirmar a exclusão
            } else {
                // handleResponse('error', 'Mensagem: ' + resposta.mensagem + '\nErro: ' + resposta.erro);
            }
        } catch (e) {
            throw Error(e.message)
        }
    }

    const handleDelete = (item: any) => {
        setDeleteOptions({
            show: true,
            itemId: item.id,
            itemDescription: item.name,
        });
    };

    const handleDeleteCallBack = (value: string) => {
        const { itemId } = deleteOptions;
        setDeleteOptions({ show: false, itemId: null, itemDescription: null });

        if (value === 'ok') {
            excluir(itemId);
            setMessageInfo({ show: true, message: 'Registro excluído com sucesso' });
        }
    };

    const handleCloseMessage = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setMessageInfo({ show: false, message: '' });
    };

    useEffect(() => {
        if (dispositivos) {
            setRows(dispositivos);
        } else {
            [];
        }
    }, []);

    return (
        <LayoutWithMenu>
            <div className={classes.toolbar}>
                <div>
                    <Typography component='h1' variant='h4'>
                        Lista de dispositivos
                    </Typography>
                </div>
                <div>
                    <Link href='/dispositivos/cadastrar' passHref>
                        <Button variant='contained' color='primary'>
                            <IconButton aria-label='allowed'><AddCircleOutline /></IconButton>
                            Cadastrar
                        </Button>
                    </Link>
                </div>
            </div>

            <TableContainer component={Paper} className={classes.table}>
                <Table aria-label='Testes'>
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Dispositivos</TableCell>
                            <TableCell>Localidades</TableCell>
                            <TableCell width='150' align='center'>
                                Ações
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell component='th' scope='row'>
                                    {row.id}
                                </TableCell>
                                <TableCell>{row.dispositivo}</TableCell>
                                <TableCell>{row.localidade}</TableCell>
                                {/*<TableCell>*/}
                                {/*    {row.status == 'Permitido' ?*/}
                                {/*        <IconButton aria-label='allowed'><Wifi /></IconButton> :*/}
                                {/*        <IconButton aria-label='not allowed'><WifiOff /></IconButton>*/}
                                {/*    }*/}
                                {/*</TableCell>*/}
                                <TableCell>
                                    <IconButton
                                        aria-label='excluir'
                                        onClick={() => handleDelete(row)}
                                    >
                                        <DeleteForever />
                                    </IconButton>
                                    <Link href={`/dispositivos/editar/${row.id}`} passHref>
                                        <IconButton aria-label='edit'>
                                            <Edit />
                                        </IconButton>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <ConfirmationDialog
                id={`delete-${deleteOptions.itemId}`}
                title='Excluir'
                confirmButtonText='Excluir'
                keepMounted
                open={deleteOptions.show}
                onClose={handleDeleteCallBack}
            >
                Confirma a exclusão do item{' '}
                <strong>{deleteOptions.itemDescription}</strong>
            </ConfirmationDialog>
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                autoHideDuration={3000}
                open={messageInfo.show}
                message={messageInfo.message}
                key={messageInfo.message}
                onClose={handleCloseMessage}
            />
        </LayoutWithMenu>
    );
}

ListaDispositivos.getInitialProps = async (ctx: NextPageContext) => {
    let url = !process.env.BASE_URL ? '/api/dispositivos' : `${process.env.BASE_URL}/api/dispositivos`;
    const resp = await fetch(url);
    const res = await resp.json();
    const json:Dispositivo[] = res.dispositivos;

    return {
        dispositivos: json
    };
}
