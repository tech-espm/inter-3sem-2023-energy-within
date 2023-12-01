import app = require("teem");
import Consumo = require("../../models/consumo");

class ConsumoApiRoute {
    public async listarTotalPorData(req: app.Request, res: app.Response) {
        let dataInicial = req.query['dataInicial'] as string;
        let dataFinal = req.query['dataFinal'] as string;

        res.json(await Consumo.listarTotalPorData(dataInicial, dataFinal));
    }

    public async listarMediaPorData(req: app.Request, res: app.Response) {
        let dataInicial = req.query['dataInicial'] as string;
        let dataFinal = req.query['dataFinal'] as string;
        let id_eletrodomestico = parseInt(req.query['id_eletrodomestico'] as string);

        res.json(await Consumo.listarMediaPorData(dataInicial, dataFinal, id_eletrodomestico));
    }

    public async listarTop5(req: app.Request, res: app.Response) {
        let dataInicial = req.query['dataInicial'] as string;
        let dataFinal = req.query['dataFinal'] as string;

        res.json(await Consumo.listarTop5(dataInicial, dataFinal));
    }

    @app.http.post()
    public async logarConsumo(req: app.Request, res: app.Response) {
        let id_eletrodomestico = parseInt(req.query['id_eletrodomestico'] as string);
        let consumo = parseFloat(req.query['consumo'] as string);

        await Consumo.logarConsumo(id_eletrodomestico, consumo);

        res.json(true);
    }
}

export = ConsumoApiRoute;