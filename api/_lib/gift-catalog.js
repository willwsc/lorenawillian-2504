const GIFT_CATALOG = {
  gift_01: { label: 'Relógio para o noivo tentar ser pontual UMA vez na vida', amount: 420 },
  gift_02: { label: 'Para noiva pagar a make e ficar intacta até o fim da festa', amount: 320 },
  gift_03: { label: 'Para noiva comprar o vale paciência (é justo que muito custe o que muito vale) kkkk', amount: 600 },
  gift_04: { label: 'Camisa do Santos pro noivo ir ver o Neymar', amount: 450 },
  gift_05: { label: 'Para o noivo comprar um lanche com 2 hambúrgueres mal passado', amount: 360 },
  gift_06: { label: 'Vaquinha para o ar condicionado', amount: 550 },
  gift_07: { label: 'Pacote de 5kg de ração para as dogs (Lisa e Cristal)', amount: 450 },
  gift_08: { label: 'Garantir o kit sobrevivência do casamento: água, remédio da ressaca e lanchinhos para o dia seguinte', amount: 360 },
  gift_09: { label: 'Cotas amigos para sempre', amount: 420 },
  gift_10: { label: '1 ano de cabelo feito para o noivo', amount: 800 },
  gift_11: { label: 'Para o noivo pegar um ursinho na máquina do shopping', amount: 340 },
  gift_12: { label: '1 par de pilhas palito para o controle do ar condicionado', amount: 450 },
  gift_13: { label: '1 par de havaianas pra noiva parar de andar descalça', amount: 420 },
  gift_14: { label: 'Camisa do Santos pro noivo ir ver o Neymar', amount: 450 },
  gift_15: { label: 'Comprar roupa de cama premium porque a noiva AMA dormir até tarde', amount: 420 },
  gift_16: { label: 'Ajudar a mobiliar a casa', amount: 1100 },
  gift_17: { label: 'Camisa do Santos pro noivo ir ver o Neymar', amount: 450 },
  gift_18: { label: 'Para o noivo comprar um relógio de respeito e nunca mais se atrasar (sonho)', amount: 1200 },
  gift_19: { label: 'Primeira compra do mercado como casados', amount: 700 },
  gift_20: { label: 'Almoço Especial para os pombinhos', amount: 380 },
  gift_21: { label: 'Para pagar um final de semana romântico e recuperar as energias', amount: 950 },
  gift_22: { label: 'Camisa do Santos pro noivo ir ver o Neymar', amount: 450 },
  gift_23: { label: 'Jogo de cama premium para a noiva dormir até tarde', amount: 900 },
  gift_24: { label: 'Para noiva investir em autocuidado pós-casamento (porque ela merece)', amount: 420 },
  gift_25: { label: 'Raspar o precioso cabelo do noivo', amount: 5000 },
};

module.exports = {
  GIFT_CATALOG,
  isValidGiftName(giftName) {
    return Object.prototype.hasOwnProperty.call(GIFT_CATALOG, giftName);
  },
  getGiftById(giftId) {
    return GIFT_CATALOG[giftId] || null;
  },
};
