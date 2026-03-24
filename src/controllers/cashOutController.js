import { existCashOut, getBalance, createCashOut, getAllTransactions } from '../models/cashOutModel.js'

export const createCashCut = async (req, res) => {
try {
const { saldo_inicial, observaciones } = req.body
const usuario_id = req.user?.id || req.body.usuario_id 


const existe = await existCashOut()
if (existe) {
  return res.status(400).json({
    ok: false,
    message: 'Ya existe un corte de caja hoy. Caja cerrada.'
  })
}

const { ventas, retiros } = await getBalance()


const result = await createCashOut(
  usuario_id,
  saldo_inicial,
  observaciones
)

if (result > 0) {
  return res.json({
    ok: true,
    message: 'Corte de caja realizado correctamente',
    data: {
      ventas,
      retiros,
      saldo_final: saldo_inicial + ventas - retiros
    }
  })
} else {
  return res.status(500).json({
    ok: false,
    message: 'No se pudo realizar el corte'
  })
}

} catch (error) {
return res.status(500).json({
ok: false,
message: 'Error en el corte de caja',
error: error.message
})
}
}


export const getTransactions = async (req, res) => {
try {
const data = await getAllTransactions()

return res.json({
  ok: true,
  data
})


} catch (error) {
return res.status(500).json({
ok: false,
message: 'Error al obtener movimientos'
})
}
}
