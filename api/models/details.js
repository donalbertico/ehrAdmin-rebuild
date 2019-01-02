/**
*Details from code
*
*the function will return an array of details object
*
*/
const iva = {
  code: '2',
  rateCode: '3',
  rate: 12
}
const detailDic = {}
const itemsInfo = [
  {
    name: 'Anunciante Plus por 1 semana',
    description:
      'Acceso a toda las recomendaciones solicitadas por los usuarios inquilinos.',
    unitPrice: 5.36,
    code: 'AP001'
  },
  {
    name: 'Anunciante Plus por 1 mes',
    description:
      'Acceso a toda las recomendaciones solicitadas por los usuarios inquilinos con un descuento de 6$.',
    unitPrice: 16.07,
    code: 'AP002'
  },
  {
    name: 'Anunciante Plus por 1 año',
    description:
      'Acceso a toda las recomendaciones solicitadas por los usuarios inquilinos con un descuento de 108$.',
    unitPrice: 102.68,
    code: 'AP003'
  },
  {
    name: 'Cliente Plus por 1 día',
    description:
      'Acceso a toda la información de todas las propiedades y demás ventajas de un cliente plus',
    unitPrice: 2.68,
    code: 'PL001'
  },
  {
    name: 'Cliente Plus por 1 semana',
    description:
      'Acceso a toda la información de todas las propiedades y demás ventajas de un cliente plus. ahorrando $16',
    unitPrice: 4.46,
    code: 'PL002'
  },
  {
    name: 'Cliente Plus por 1 mes',
    description:
      'Acceso a toda la información de todas las propiedades y demás ventajas de un cliente plus. ahorrando $80',
    unitPrice: 8.93,
    code: 'PL003'
  },
  {
    name: 'Token para 1 propiedad',
    description:
      'Renovación automática para 1 propiedad durante un mes, dos veces por semana.',
    unitPrice: 2.68,
    code: 'TO001'
  },
  {
    name: 'Tokens para 10 propiedades',
    description:
      'Renovación automática para 25 propiedades durante un mes, dos veces por semana. ahorrando $30',
    unitPrice: 17.86,
    code: 'TO002'
  },
  {
    name: 'Token para 25 propiedades',
    description:
      'Renovación automática para 25 propiedades durante un mes, dos veces por semana. ahorrando $75',
    unitPrice: 33.48,
    code: 'TO003'
  },
  {
    name: 'Tokens para 50 propiedades',
    description:
      'Renovación automática para 50 propiedades durante un mes, dos veces por semana. ahorrando $150',
    unitPrice: 44.64,
    code: 'TO004'
  }
]

itemsInfo.forEach((item) => {
  const fullPrice = parseInt(item.unitPrice / (1 - (iva.rate / 100)))
  const tax = {
    priceBase: item.unitPrice,
    value: (fullPrice * (iva.rate / 100)).toFixed(2),
    code: iva.code,
    rate: iva.rate,
    rateCode: iva.rateCode
  }
  detailDic[item.code] = {
    name: item.name,
    description: item.description,
    unitPrice: fullPrice,
    code: item.code
  }
  detailDic[item.code].taxes = [tax]
})

module.exports = {
  /**
  *
  *Recives a code and translated to a complete detail object calculating the taxes
  *
  *@property {String} code product code to get info
  *@property {String} qty quantity pruchased
  *@property {String} discount discount applayed on product
  *
  *
  **/
  detailFromCode: (code, qty, discount) => {
    const detail = detailDic[code]
    if (!detail) return null
    let taxTotal = 0
    detail.taxes.forEach((item) => {
      taxTotal += item.value
    })
    detail['qty'] = qty || 1
    detail['discount'] = discount || 0
    detail['subtotal'] = (detail.qty * detail.unitPrice) - detail.discount - taxTotal
    detail['total'] = detail.unitPrice * detail.qty - detail.discount
    detail['taxTotal'] = taxTotal
    if (code.substring(0, 2) === 'PL') {
      detail['type'] = 'plan'
    } else if (code.substring(0, 2) === 'TO') {
      detail['type'] = 'token'
    } else {
      detail['type'] = 'plusannouncer'
    }
    return detail
  },
  /**
  *
  *Recives a code and return an object for updating to the payer
  *
  *@property {String} code product code to get info
  *
  *
  **/
  benefitsFromCode: (code) => {
    const prod = detailDic[code]
    const benefits = {}
    if (code.substring(0, 2) === 'PL') {
      benefits['type'] = 'plan'
      switch (prod.unitPrice) {
        case 3:
          benefits['add'] = { days: 1 }
          break
        case 5:
          benefits['add'] = { days: 7 }
          break
        case 10:
          benefits['add'] = { months: 1 }
          break
      }
    } else if (code.substring(0, 2) === 'TO') {
      benefits['type'] = 'token'
      switch (prod.code) {
        case 'TO001':
          benefits['add'] = { tokens: 1 }
          break
        case 'TO002':
          benefits['add'] = { tokens: 10 }
          break
        case 'TO003':
          benefits['add'] = { tokens: 25 }
          break
        case 'TO004':
          benefits['add'] = { tokens: 50 }
          break
      }
    } else {
      benefits['type'] = 'plusannouncer'
      switch (prod.code) {
        case 'AP001':
          benefits['add'] = { days: 7 }
          break
        case 'AP002':
          benefits['add'] = { months: 1 }
          break
        case 'AP003':
          benefits['add'] = { days: 365 }
          break
      }
    }
    return benefits
  }
}
