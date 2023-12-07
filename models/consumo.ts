import app = require("teem");

interface Eletrodomestico {
    id_eletrodomestico: number;
    nome_eletrodomestico: string;
}

interface ConsumoTotal {
    consumo: number;
    dia: string;
}

interface Consumo {
    id_eletrodomestico: number;
    nome_eletrodomestico: string;
    consumo: number;
    dia: string;
}

class Consumo {
    public static async listarEletrodomesticos(): Promise<Eletrodomestico[]> {
        let lista: Eletrodomestico[] = [];

        await app.sql.connect(async (sql: app.Sql) => {
            lista = await sql.query(`
                SELECT
                id_eletrodomestico,
                nome_eletrodomestico
                FROM eletrodomestico
                ORDER BY nome_eletrodomestico
            `)
        });

        return lista;
    }

    public static async listarTotalPorData(dataInicial: string, dataFinal: string): Promise<ConsumoTotal[]> {
        let lista: ConsumoTotal[] = [];
        dataInicial += ' 00:00:00';
        dataFinal += ' 23:59:59';
        let parametros = [dataInicial, dataFinal];
        await app.sql.connect(async (sql: app.Sql) => {
            lista = await sql.query(`
                SELECT
                sum(c.consumo) consumo,
                date(data) dt,
                date_format(data, '%d/%m') dia
                FROM consumo c
                WHERE c.data between ? and ?
                group by dt, dia
                ORDER BY dt
            `, parametros)
        });

        return lista;
    }

    public static async listarMediaPorData(dataInicial: string, dataFinal: string, id_eletrodomestico?: number): Promise<Consumo[]> {
        let lista: Consumo[] = [];
        dataInicial += ' 00:00:00';
        dataFinal += ' 23:59:59';
        let parametros = [dataInicial, dataFinal, id_eletrodomestico || 0];
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
                WHERE c.data between ? and ? ${(id_eletrodomestico ? " and c.id_eletrodomestico = ?" : "")}
                group by c.id_eletrodomestico, e.nome_eletrodomestico, dt, dia
                ORDER BY dt, c.id_eletrodomestico
            `, parametros)
        });

        return lista;
    }

    public static async listarTop5(dataInicial: string, dataFinal: string): Promise<Consumo[]> {
        let lista: Consumo[] = [];
        dataInicial += ' 00:00:00';
        dataFinal += ' 23:59:59';
        let parametros = [dataInicial, dataFinal];
        await app.sql.connect(async (sql: app.Sql) => {
            lista = await sql.query(`
                SELECT
                c.id_eletrodomestico,
                e.nome_eletrodomestico nome,
                sum(c.consumo) consumo
                FROM consumo c
                INNER JOIN eletrodomestico e ON e.id_eletrodomestico = c.id_eletrodomestico
                WHERE c.data between ? and ?
                group by c.id_eletrodomestico
                order by consumo desc
                limit 5;
            `, parametros)
        });

        return lista;
    }

    public static async logarConsumo(id_eletrodomestico: number, consumo: number): Promise<void> {
        await app.sql.connect(async (sql: app.Sql) => {
            const lista: any[] = await sql.query("SELECT extract(DAY from data) dia, extract(MONTH from data) mes, extract(YEAR from data) ano, extract(HOUR from data) hora FROM consumo WHERE id_eletrodomestico = ? ORDER BY id_consumo DESC LIMIT 1", [id_eletrodomestico]);

            let ano: number, mes: number, dia: number, hora: number;

            if (!lista || !lista.length) {
                const agora = new Date();
                ano = agora.getFullYear();
                mes = agora.getMonth() + 1;
                dia = agora.getDate();
                hora = agora.getHours();
            } else {
                ano = lista[0].ano;
                mes = lista[0].mes;
                dia = lista[0].dia;
                hora = lista[0].hora;
            }

            hora++;
            if (hora > 23) {
                hora = 0;
                dia++;

                let diaLimite = 31;
                switch (mes) {
                    case 2:
                        if (!(ano % 4) && ((ano % 100) || !(ano % 400))) {
                            diaLimite = 29;
                        } else {
                            diaLimite = 28;
                        }
                        break;
                    case 4:
                    case 6:
                    case 9:
                    case 11:
                        diaLimite = 30;
                        break;
                }

                if (dia > diaLimite) {
                    dia = 1;
                    mes++;

                    if (mes > 12) {
                        mes = 1;
                        ano++;
                    }
                }
            }

            await sql.query("INSERT INTO consumo (id_eletrodomestico, data, consumo) VALUES (?, ?, ?)", [id_eletrodomestico || 0, `${ano}-${mes}-${dia} ${hora}:00:00`, (consumo || 0) / 10]);
        });
    }
}

export = Consumo;