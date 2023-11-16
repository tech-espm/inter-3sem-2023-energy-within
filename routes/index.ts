import app = require("teem");
import Consumo = require("../models/consumo");

class IndexRoute {
	public async index(req: app.Request, res: app.Response) {
		let hoje = new Date();

		let mesFinal = hoje.getMonth() + 1;
		let diaFinal = hoje.getDate();

		let semanaPassada = new Date(hoje.getTime() - 7 * 24 * 60 * 60 * 1000);

		let mesInicial = semanaPassada.getMonth() + 1;
		let diaInicial = semanaPassada.getDate();

		let opcoes = {
			anoInicial: semanaPassada.getFullYear(),
			mesInicial: (mesInicial < 10 ? "0" + mesInicial : mesInicial),
			diaInicial: (diaInicial < 10 ? "0" + diaInicial : diaInicial),

			anoFinal: hoje.getFullYear(),
			mesFinal: (mesFinal < 10 ? "0" + mesFinal : mesFinal),
			diaFinal: (diaFinal < 10 ? "0" + diaFinal : diaFinal)
		};

		res.render("index/index", opcoes);
	}

	public async pessoas(req: app.Request, res: app.Response) {
		let hoje = new Date();

		let mes = hoje.getMonth() + 1;
		let dia = hoje.getDate();

		let opcoes = {
			titulo: "Relatório por Eletrodoméstico",

			ano: hoje.getFullYear(),
			mes: (mes < 10 ? "0" + mes : mes),
			dia: (dia < 10 ? "0" + dia : dia)
		};

		res.render("index/eletrodomestico", opcoes);
	}

	public async sobre(req: app.Request, res: app.Response) {
		let opcoes = {
			titulo: "Sobre"
		};

		res.render("index/sobre", opcoes);
	}

	public async obterDados(req: app.Request, res: app.Response) {

		let dataInicio = req.query['dataInicio'] as string;
		let dataFinal = req.query['dataFinal'] as string;

		res.json(await Consumo.listarMediaPorData(dataInicio, dataFinal));
	}
}

export = IndexRoute;
