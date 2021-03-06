import {
  Button,
  Container,
  createStyles,
  IconButton,
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
import React, {useEffect, useState} from 'react';
import * as Yup from 'yup';
import LayoutWithMenu from '../../layout/LayoutWithMenu/LayoutWithMenu';
import FormLoadingComponent from '../../screen/FormLoading/FormLoading';
import {SnackbarProvider, useSnackbar, VariantType} from 'notistack';
import {atualizarDados, obterDadosId, postarDados} from '../../../lib/RESTClient';
import InputAdornment from '@material-ui/core/InputAdornment';
import PersonIcon from '@material-ui/icons/Person';
import MailIcon from '@material-ui/icons/Mail';
import LockIcon from '@material-ui/icons/Lock';


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
  primeiroNome?: string
  ultimoNome?: string
  email?: string
  senha?: string
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
    primerioNome: Yup.string()
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
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: formSchema,
    onSubmit: (values) => {
      setTimeout(() => {
        if (id) {
          atualizar(values);
        } else {
          postar(values);
        }
      }, 500);
    },
  });

  async function atualizar(values) {
    try {
      const resposta = await atualizarDados('/api/usuarios', values);

      formik.setSubmitting(false);

      if (resposta.sucesso === true) {
        handleResponse('success', `Usu??rio: ${resposta.usuario.primeiroNome} cadastrado(a) com sucesso!`);
        Router.push('/usuarios');
      } else {
        handleResponse('error', 'Mensagem: ' + resposta.mensagem + '\nErro: ' + resposta.erro);
      }
    } catch (e) {
      throw Error(e.message);
    }
  }

  async function postar(values) {
    const resposta = await postarDados('/api/usuarios', values);

    formik.setSubmitting(false);

    if (resposta.sucesso === true) {
      console.log('cadastrado com sucesso!!!');
      handleResponse('success', `Usu??rio: ${resposta.usuario.primeiroNome} cadastrado(a) com sucesso!`);
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
        senha: usuario.senha,
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
              required
              placeholder='Insira seu nome aqui'
              name='primeiroNome'
              autoComplete='primeiroNome'
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
              autoComplete='ultimoNome'
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

