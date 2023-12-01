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
        let parametros = [id_eletrodomestico || 0, consumo || 0];
        await app.sql.connect(async (sql: app.Sql) => {
            await sql.query("INSERT INTO consumo (id_eletrodomestico, data, consumo) VALUES (?, now(), ?)", parametros)
        });
    }
}

export = Consumo;