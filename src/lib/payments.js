import { socialLinks } from '../data/fragrances';
import { buildWhatsAppOrder } from './cart';

/**
 * Adaptador de checkout.
 * Fase 1: WhatsApp (activo).
 * Fase 2: implementar GatewayProvider (Wompi / MercadoPago / PayU / ePayco)
 * con la misma firma { label, checkout(order) } sin tocar el carrito.
 */
export const WhatsAppProvider = {
  id: 'whatsapp',
  label: 'Confirmar pedido por WhatsApp',
  enabled: true,
  checkout(items) {
    const url = `${socialLinks.whatsapp}?text=${buildWhatsAppOrder(items)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    return { ok: true, provider: 'whatsapp' };
  },
};

// Plantilla lista para la pasarela futura del cliente.
// Ejemplo: export const WompiProvider = { id:'wompi', label:'Pagar en línea', enabled:false, async checkout(order){...} }
export const GatewayProvider = {
  id: 'gateway',
  label: 'Pagar en línea',
  enabled: false,
  checkout() {
    return { ok: false, reason: 'gateway-not-configured' };
  },
};

export const checkoutProviders = [WhatsAppProvider, GatewayProvider];

export const buildOrder = (items) => ({
  items: items.map(({ key, kind, codigo, name, size, sizeLabel, unitPrice, qty, image, meta }) => ({
    key, kind, codigo, name, size, sizeLabel, unitPrice, qty, image, meta,
  })),
  currency: 'COP',
  customer: null, // Fase 2: { nombre, telefono, direccion, ciudad }
});
