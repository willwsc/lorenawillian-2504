const GIFT_CATALOG = {
  gift_01: { label: 'Relógio para o noivo tentar ser pontual UMA vez na vida', amount: 0 },
  gift_02: { label: 'Make da noiva', amount: 0 },
  gift_03: { label: 'Vale paciência da noiva', amount: 0 },
  gift_04: { label: 'Camisa do Santos para o noivo ir ver o Neymar', amount: 0 },
  gift_05: { label: 'Lanche do noivo', amount: 0 },
  gift_06: { label: 'Vaquinha para o ar condicionado', amount: 0 },
  gift_07: { label: 'Ração das dogs (Lisa e Cristal)', amount: 0 },
  gift_08: { label: 'Kit sobrevivência do casamento', amount: 0 },
  gift_09: { label: 'Amigos para sempre', amount: 0 },
  gift_10: { label: '1 ano de cabelo do noivo', amount: 0 },
  gift_11: { label: 'Ursinho da máquina', amount: 0 },
  gift_12: { label: 'Pilhas do controle do ar', amount: 0 },
  gift_13: { label: 'Havaianas da noiva', amount: 0 },
  gift_14: { label: 'Camisa do Santos para o noivo ir ver o Neymar', amount: 0 },
  gift_15: { label: 'Roupa de cama premium', amount: 0 },
  gift_16: { label: 'Mobiliar a casa', amount: 0 },
  gift_18: { label: 'Relógio de respeito do noivo', amount: 0 },
  gift_19: { label: 'Primeira compra do mercado', amount: 0 },
  gift_20: { label: 'Almoço especial para os pombinhos', amount: 0 },
  gift_21: { label: 'Final de semana romântico', amount: 0 },
  gift_22: { label: 'Camisa do Santos para o noivo ir ver o Neymar', amount: 0 },
  gift_23: { label: 'Jogo de cama premium', amount: 0 },
  gift_24: { label: 'Autocuidado da noiva', amount: 0 },
  gift_25: { label: 'Raspar o cabelo do noivo', amount: 0 },
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

