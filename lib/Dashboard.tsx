import {Dispositivo} from "./Dispositivo";

export interface Dashboard {
    id?: string;
    dataHora?: Date;
    wifi: Number;
    voltagem: Number;
    nivel: Number;
    dispositivoId: Number;
    dispositivo: Dispositivo;
}