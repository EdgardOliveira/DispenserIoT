import { Avatar, Box, createStyles, Link, makeStyles, Theme } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import InputAdornment from '@material-ui/core/InputAdornment';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import LockIcon from '@material-ui/icons/Lock';
import MailIcon from '@material-ui/icons/Mail';
import PersonIcon from '@material-ui/icons/Person';
import { useFormik } from 'formik';
import NextLink from 'next/link';
import React from 'react';
import * as Yup from 'yup';
import CopyrightComponent from '../components/screen/Copyright/Copyright';
import FormLoadingComponent from '../components/screen/FormLoading/FormLoading';
import { SnackbarProvider, VariantType, useSnackbar } from 'notistack';
import Router from "next/router";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap-reverse',
            minHeight: '100vh',
            gap: theme.spacing(5),
            padding: theme.spacing(2),
        },
        sloganTitle: {
            marginBottom: theme.spacing(2),
        },
        form: {
            padding: theme.spacing(4),
            maxWidth: '370px',
        },
        submit: {
            marginTop: theme.spacing(2),
        },
        divider: {
            margin: theme.spacing(4, 0),
        },
    }),
);

interface IFormData {
    primeiroNome?: string;
    ultimoNome?: string;
    email?: string;
    senha?: string;
    confirmacao_senha?: string;
}

export default function Registro() {
    return (
        <SnackbarProvider maxSnack={3}>
            <CreateAccountPage />
        </SnackbarProvider>
    );
}

export function CreateAccountPage() {
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();

    const initialValues: IFormData = {
        primeiroNome: '',
        ultimoNome: '',
        email: '',
        senha: '',
        confirmacao_senha: '',
    };

    const formSchema = Yup.object().shape({
        primeiroNome: Yup.string()
            .required('Obrigat??rio')
            .min(3, 'O nome deve ter pelo menos 3 caracteres'),
        ultimoNome: Yup.string()
            .required('Obrigat??rio')
            .min(3, 'O sobrenome deve ter pelo menos 3 caracteres'),
        email: Yup.string()
            .email('E-mail inv??lido')
            .required('Obrigat??rio'),
        senha: Yup.string()
            .min(8, 'A senha deve ter pelo menos 8 caracteres')
            .required('Obrigat??rio'),
        confirmacao_senha: Yup.string()
            .oneOf([Yup.ref('senha'), null], 'A senha informada ?? diferente da confirma????o')
            .required('Obrigat??rio'),
    });

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: formSchema,
        onSubmit: (values) => {
            setTimeout(() => {
                enviarDados(values);
            }, 500);
        },
    });

    async function enviarDados(values) {
        const resp = await fetch(`/api/autenticacao/registro`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                primeiroNome: values.primeiroNome,
                ultimoNome: values.ultimoNome,
                email: values.email,
                senha: values.senha,
            }),
        });

        const resposta = await resp.json();
        console.log('Resposta...\n' + JSON.stringify(resposta));

        formik.setSubmitting(false);

        if (resposta.sucesso === true) {
            handleResponse('success', `Usu??rio: ${resposta.usuario.primeiroNome} ${resposta.usuario.ultimoNome} cadastrado(a) com sucesso!`);
            console.log('sucesso!');
            await Router.push('/dashboards');
        } else {
            handleResponse('error', 'Erro: ' + resposta.mensagem);
            console.log('erro!');
        }
    }

    async function handleResponse(variant: VariantType, mensagem: String) {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(mensagem, { variant });
    }

    return (
        <div className={classes.root}>
            <Paper className={classes.form} elevation={3}>
                <Box textAlign='center'>
                    <Typography component='h3' variant='h5'>
                        Crie sua conta
                    </Typography>
                </Box>

                <form noValidate onSubmit={formik.handleSubmit}>
                    <TextField
                        variant='outlined'
                        margin='normal'
                        fullWidth
                        id='primeiroNome'
                        label='Nome'
                        required
                        placeholder='Insira seu nome aqui'
                        name='primeiroNome'
                        autoComplete='nome'
                        autoFocus
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position='start'>
                                    <PersonIcon />
                                </InputAdornment>
                            ),
                        }}
                        onChange={formik.handleChange}
                        value={formik.values.primeiroNome}
                        error={formik.touched.primeiroNome && Boolean(formik.errors.primeiroNome)}
                        helperText={formik.touched.primeiroNome && formik.errors.primeiroNome}
                    />
                    <TextField
                        variant='outlined'
                        margin='normal'
                        fullWidth
                        id='ultimoNome'
                        label='Sobrenome'
                        required
                        placeholder='Insira seu sobrenome aqui'
                        name='ultimoNome'
                        autoComplete='sobrenome'
                        autoFocus
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position='start'>
                                    <PersonIcon />
                                </InputAdornment>
                            ),
                        }}
                        onChange={formik.handleChange}
                        value={formik.values.ultimoNome}
                        error={formik.touched.ultimoNome && Boolean(formik.errors.ultimoNome)}
                        helperText={formik.touched.ultimoNome && formik.errors.ultimoNome}
                    />
                    <TextField
                        variant='outlined'
                        margin='normal'
                        fullWidth
                        id='email'
                        label='E-mail'
                        required
                        placeholder='Insira seu e-mail aqui'
                        name='email'
                        autoComplete='email'
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position='start'>
                                    <MailIcon />
                                </InputAdornment>
                            ),
                        }}
                        onChange={formik.handleChange}
                        value={formik.values.email}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                    />
                    <TextField
                        variant='outlined'
                        margin='normal'
                        fullWidth
                        name='senha'
                        label='Senha'
                        required
                        placeholder='Insira sua senha aqui'
                        type='password'
                        id='senha'
                        autoComplete='senha'
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position='start'>
                                    <LockIcon />
                                </InputAdornment>
                            ),
                        }}
                        onChange={formik.handleChange}
                        value={formik.values.senha}
                        error={formik.touched.senha && Boolean(formik.errors.senha)}
                        helperText={formik.touched.senha && formik.errors.senha}
                    />
                    <TextField
                        variant='outlined'
                        margin='normal'
                        fullWidth
                        name='confirmacao_senha'
                        label='Confirma????o de senha'
                        required
                        placeholder='Confirme sua senha aqui'
                        type='password'
                        id='confirmacao_senha'
                        autoComplete='off'
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position='start'>
                                    <LockIcon />
                                </InputAdornment>
                            ),
                        }}
                        onChange={formik.handleChange}
                        value={formik.values.confirmacao_senha}
                        error={
                            formik.touched.confirmacao_senha &&
                            Boolean(formik.errors.confirmacao_senha)
                        }
                        helperText={
                            formik.touched.confirmacao_senha && formik.errors.confirmacao_senha
                        }
                    />
                    <Button
                        className={classes.submit}
                        type='submit'
                        size='large'
                        fullWidth
                        variant='contained'
                        color='primary'
                        disabled={formik.isSubmitting}
                    >
                        Criar minha conta
                    </Button>
                    {formik.isSubmitting && <FormLoadingComponent />}
                </form>

                <p>
                    Ao se registrar, voc?? concorda com os{' '}
                    <Link href='#'>termos de uso</Link> e a{' '}
                    <Link href='#'>pol??tica de privacidade</Link> do app.
                </p>

                <Divider className={classes.divider} variant='fullWidth' />

                <CopyrightComponent />
            </Paper>
            <div>
                <Typography className={classes.sloganTitle} variant='h3' component='h1'>
                    IoT Monitor
                </Typography>
                <Typography variant='h4' component='h2'>
                    Registre-se!
                </Typography>
                <Box mt={10}>
                    <NextLink href='login' passHref>
                        <Button color='primary' startIcon={<ArrowBackIcon />}>
                            Voltar
                        </Button>
                    </NextLink>
                </Box>
            </div>
        </div>
    );
}