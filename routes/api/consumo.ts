import app = require("teem");
import Consumo = require("../../models/consumo");

class ConsumoApiRoute {
    public async listar(req: app.Request, res: app.Response) {
        res.json(await Consumo.listarMediaPorData(req.query["dataInicio"] as string, req.query["dataFinal"] as string));
    }
}

export = ConsumoApiRoute;