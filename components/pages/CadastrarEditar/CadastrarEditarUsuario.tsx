import {
    Button,
    Container,
    createStyles,
    IconButton,
    InputLabel,
    makeStyles,
    Paper,
    TextField,
    Theme,
    Typography,
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import {useFormik} from 'formik';
import Link from 'next/link';
import Router, {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import * as Yup from 'yup';
import LayoutWithMenu from '../../layout/LayoutWithMenu/LayoutWithMenu';
import FormLoadingComponent from '../../screen/FormLoading/FormLoading';
import {SnackbarProvider, useSnackbar, VariantType} from 'notistack';
import {atualizarDados, obterDadosId, postarDados} from '../../../lib/RESTClient';


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        toolbar: {
            display: 'flex',
            alignItems: 'center',
        },
        form: {
            marginTop: theme.spacing(3),
            padding: theme.spacing(3),
        },
        submit: {
            marginTop: theme.spacing(2),
        },
        formControl: {
            margin: theme.spacing(0),
            marginTop: theme.spacing(2),
            minWidth: 100,
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
    }),
);

interface IFormData {
    id?: number
    primeiroNome: string
    ultimoNome: string
    email: string
    senha: string
}

export default function Usuarios() {
    return (
        <SnackbarProvider maxSnack={3}>
            <Usuario />
        </SnackbarProvider>
    );
}

export function Usuario() {
    const classes = useStyles();
    const router = useRouter();
    const { id } = router.query;
    const { enqueueSnackbar } = useSnackbar();
    const [title, setTitle] = useState('Cadastrar');

    const initialValues: IFormData = {
        id: -1,
        primeiroNome: '',
        ultimoNome: '',
        email: '',
        senha: '',
    };

    async function handleResponse(variant: VariantType, mensagem: String) {
        enqueueSnackbar(mensagem, { variant });
    }

    const formSchema = Yup.object().shape({
        primeiroNome: Yup.string()
            .required('Campo obrigatório')
            .min(3, 'O primeiro nome deve ter pelo menos 3 caracteres'),
        ultimoNome: Yup.string()
            .required('Campo obrigatório')
            .min(2, 'O último nome deve ter pelo menos 2 caracteres'),
        email: Yup.string()
            .required('Campo obrigatório')
            .min(3, 'O e-mail deve ter pelo menos 3 caracteres'),
        senha: Yup.string()
            .required('Campo obrigatório')
            .min(3, 'A senha deve ter pelo menos 3 caracteres'),
    });

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: formSchema,
        onSubmit: (values) => {
            setTimeout(() => {
                if(id){
                    atualizar(values)
                }else{
                    postar(values);
                }
            }, 500);
        },
    });

    async function atualizar(values){
        try {
            const resposta = await atualizarDados('/api/usuarios', values);

            formik.setSubmitting(false);

            if (resposta.sucesso === true) {
                console.log(`resposta: ${JSON.stringify(resposta)}`);
                handleResponse('success', `Usuario: ${resposta.usuario.primeiroNome} cadastrado(a) com sucesso!`);
                Router.push('/usuarios');
            } else {
                handleResponse('error', 'Mensagem: ' + resposta.mensagem + '\nErro: ' + resposta.erro);
            }
        } catch (e) {
            throw Error(e.message)
        }
    }

    async function postar(values) {
        const resposta = await postarDados('/api/usuarios', values)

        formik.setSubmitting(false);

        if (resposta.sucesso === true) {
            handleResponse('success', `Usuário: ${resposta.usuario.primeiroNome} cadastrado(a) com sucesso!`);
            Router.push('/usuarios');
        } else {
            handleResponse('error', 'Mensagem: ' + resposta.mensagem + '\nErro: ' + resposta.erro);
        }
    }

    async function obter(id: string | string[]) {
        const resposta = await obterDadosId(`/api/usuarios/${id}`);
        const usuario = resposta.usuario;
        formik.setSubmitting(false);

        if (resposta.sucesso === true) {
            handleResponse('success', `Registro recuperado com sucesso!`);
            formik.setValues({
                id: usuario.id,
                primeiroNome: usuario.primeiroNome,
                ultimoNome: usuario.ultimoNome,
                email: usuario.email,
                senha: usuario.senha
            });
        } else {
            handleResponse('error', 'Erro: ' + resposta.mensagem);
        }
    }

    useEffect(() => {
        if (id) {
            setTitle(`Editar`);
            obter(id);
        }
    }, [id]);

    return (
        <LayoutWithMenu>
            <Container>
                <div className={classes.toolbar}>
                    <Link href='/usuarios' passHref>
                        <IconButton aria-label='Voltar'>
                            <ArrowBackIcon />
                        </IconButton>
                    </Link>
                    <Typography component='h1' variant='h4'>
                        {title}
                    </Typography>
                </div>

                <Paper className={classes.form} elevation={3}>
                    <form noValidate onSubmit={formik.handleSubmit}>
                        <TextField
                            variant='outlined'
                            margin='normal'
                            fullWidth
                            id='primeiroNome'
                            label='Nome'
                            placeholder='Insira o seu primeiro nome  aqui'
                            name='primeiroNome'
                            required
                            autoComplete='primeiroNome'
                            autoFocus
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
                            placeholder='Insira o seu últmimo nome aqui'
                            name='ultimoNome'
                            autoComplete='ultimoNome'
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
                            placeholder='Insira o seu email aqui'
                            name='email'
                            autoComplete='email'
                            onChange={formik.handleChange}
                            value={formik.values.email}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />
                        <TextField
                            variant='outlined'
                            margin='normal'
                            fullWidth
                            id='senha'
                            label='Senha'
                            required
                            placeholder='Insira a sua senha aqui'
                            name='senha'
                            autoComplete='senha'
                            onChange={formik.handleChange}
                            value={formik.values.senha}
                            error={formik.touched.senha && Boolean(formik.errors.senha)}
                            helperText={formik.touched.senha && formik.errors.senha}
                        />

                        <Button
                            className={classes.submit}
                            type='submit'
                            size='large'
                            variant='contained'
                            color='primary'
                            disabled={formik.isSubmitting}
                        >
                            Salvar
                        </Button>
                        {formik.isSubmitting && <FormLoadingComponent />}
                    </form>
                </Paper>
            </Container>
        </LayoutWithMenu>
    );
}