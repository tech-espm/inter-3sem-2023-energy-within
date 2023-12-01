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

	public async eletrodomestico(req: app.Request, res: app.Response) {
		let hoje = new Date();

		let mesFinal = hoje.getMonth() + 1;
		let diaFinal = hoje.getDate();

		let semanaPassada = new Date(hoje.getTime() - 7 * 24 * 60 * 60 * 1000);

		let mesInicial = semanaPassada.getMonth() + 1;
		let diaInicial = semanaPassada.getDate();

		let opcoes = {
			titulo: "Relatório por Eletrodoméstico",

			eletrodomesticos: await Consumo.listarEletrodomesticos(),

			anoInicial: semanaPassada.getFullYear(),
			mesInicial: (mesInicial < 10 ? "0" + mesInicial : mesInicial),
			diaInicial: (diaInicial < 10 ? "0" + diaInicial : diaInicial),

			anoFinal: hoje.getFullYear(),
			mesFinal: (mesFinal < 10 ? "0" + mesFinal : mesFinal),
			diaFinal: (diaFinal < 10 ? "0" + diaFinal : diaFinal)
		};

		res.render("index/eletrodomestico", opcoes);
	}

	public async top5(req: app.Request, res: app.Response) {
		var dataAtual = new Date();

		// Obtendo os componentes da data
		var dia = dataAtual.getDate();
		var mes = dataAtual.getMonth() + 1; // Lembre-se que os meses são zero-indexed
		var ano = dataAtual.getFullYear();

		let dataInicial = ano + '-' + mes + '-' + (dia - 30)
		let dataFinal = ano + '-' + mes + '-' + dia

		let opcoes = {
			dataInicial: dataInicial,
			dataFinal: dataFinal,

			consumos: await Consumo.listarTop5(dataInicial, dataFinal)
		}

		res.render("index/top5", opcoes)
	}

	public async sobre(req: app.Request, res: app.Response) {
		let opcoes = {
			titulo: "Sobre"
		};

		res.render("index/sobre", opcoes);
	}
}

export = IndexRoute;
