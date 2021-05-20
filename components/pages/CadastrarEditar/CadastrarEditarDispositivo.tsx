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
    dispositivo?: string
    localidade?: string
}

export default function Dispositivos() {
    return (
        <SnackbarProvider maxSnack={3}>
            <Dispositivo />
        </SnackbarProvider>
    );
}

export function Dispositivo() {
    const classes = useStyles();
    const router = useRouter();
    const { id } = router.query;
    const { enqueueSnackbar } = useSnackbar();
    const [title, setTitle] = useState('Cadastrar');

    const initialValues: IFormData = {
        id: -1,
        dispositivo: '',
        localidade: '',
    };

    async function handleResponse(variant: VariantType, mensagem: String) {
        enqueueSnackbar(mensagem, { variant });
    }

    const formSchema = Yup.object().shape({
        dispositivo: Yup.string()
            .required('Campo obrigatório')
            .min(5, 'O dispositivo deve ter pelo menos 5 caracteres'),
        localidade: Yup.string()
            .required('Campo obrigatório')
            .min(5, 'A localidade deve ter pelo menos 5 caracteres'),
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
            const resposta = await atualizarDados('/api/dispositivos', values);

            formik.setSubmitting(false);

            if (resposta.sucesso === true) {
                handleResponse('success', `Dispositivo: ${resposta.dispositivo.dispositivo} cadastrado(a) com sucesso!`);
                Router.push('/dispositivos');
            } else {
                handleResponse('error', 'Mensagem: ' + resposta.mensagem + '\nErro: ' + resposta.erro);
            }
        } catch (e) {
            throw Error(e.message)
        }
    }

    async function postar(values) {
        const resposta = await postarDados('/api/dispositivos', values)

        formik.setSubmitting(false);

        if (resposta.sucesso === true) {
            handleResponse('success', `Dispositivo: ${resposta.dispositivo.dispositivo} cadastrado(a) com sucesso!`);
            Router.push('/dispositivos');
        } else {
            handleResponse('error', 'Mensagem: ' + resposta.mensagem + '\nErro: ' + resposta.erro);
        }
    }

    async function obter(id: string | string[]) {
        const resposta = await obterDadosId(`/api/dispositivos/${id}`);
        const dispositivo = resposta.dispositivo;
        formik.setSubmitting(false);

        if (resposta.sucesso === true) {
            handleResponse('success', `Registro recuperado com sucesso!`);
            formik.setValues({
                id: dispositivo.id,
                dispositivo: dispositivo.dispositivo,
                localidade: dispositivo.localidade,
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
                    <Link href='/dispositivos' passHref>
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
                            id='dispositivo'
                            label='Dispositivo'
                            placeholder='Insira o dispositivo  aqui'
                            name='dispositivo'
                            required
                            autoComplete='dispositivo'
                            autoFocus
                            onChange={formik.handleChange}
                            value={formik.values.dispositivo}
                            error={formik.touched.dispositivo && Boolean(formik.errors.dispositivo)}
                            helperText={formik.touched.dispositivo && formik.errors.dispositivo}
                        />
                        <TextField
                            variant='outlined'
                            margin='normal'
                            fullWidth
                            id='localidade'
                            label='Localidade'
                            required
                            placeholder='Insira a localidade aqui'
                            name='localidade'
                            autoComplete='localidade'
                            onChange={formik.handleChange}
                            value={formik.values.localidade}
                            error={formik.touched.localidade && Boolean(formik.errors.localidade)}
                            helperText={formik.touched.localidade && formik.errors.localidade}
                        />
                        <InputLabel htmlFor='outlined-age-native-simple'>Status</InputLabel>

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