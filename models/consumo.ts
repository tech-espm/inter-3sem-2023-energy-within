import app = require("teem");

interface Consumo {
    id_consumo: number;
    id_eletrodomestico: number;
    dia: string;
    consumo: number;
    nome_eletrodomestico: string;
}

class Consumo {
    public static async listarMediaPorData(dataInicio: string, dataFinal: string): Promise<Consumo[]> {
        let lista: Consumo[] = [];
        dataInicio += ' 00:00:00';
        dataFinal += ' 23:59:59';
        let parametros = [dataInicio, dataFinal];
        await app.sql.connect(async (sql: app.Sql) => {
            lista = await sql.query(`
                SELECT
                c.id_eletrodomestico,
                e.nome_eletrodomestico,
                avg(c.consumo) consumo,
                date(data) dt,
                date_format(data, '%d/%m') dia
                FROM consumo c
                INNER JOIN eletrodomestico e ON e.id_eletrodomestico = c.id_eletrodomestico
                WHERE c.data between ? and ?
                group by c.id_eletrodomestico, e.nome_eletrodomestico, dt, dia
                ORDER BY dt
            `, parametros)
        });

        return lista;
    }
}

export = Consumo;