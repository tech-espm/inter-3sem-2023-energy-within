import app = require("teem");

interface Consumo {
    id_consumo: number;
    id_eletrodomestico: number;
    data: string;
    consumo: number;
    nome_eletrodomestico: string;
}

class Consumo {
    public static async listarConsumos() {
        let lista: Consumo[] = [];
        await app.sql.connect(async (sql: app.Sql) => {
            lista = await sql.query(`
            select c.consumo, e.nome_eletrodomestico
                FROM consumo c inner join eletrodomestico e
                on c.id_eletrodomestico = e.id_eletrodomestico
                GROUP BY c.id_eletrodomestico`)
        });
    }
}