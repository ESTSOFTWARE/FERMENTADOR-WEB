import type { ProductRepository } from '../../domain/repositories/ProductRepository'
import type { Product }           from '../../domain/models/Product'

// TODO: reemplazar con productsApi cuando el endpoint /products esté listo
const MOCK_PRODUCTS: Product[] = [
  {
    id:          1,
    name:        'Kit Fermentador Nich-Ká Basic',
    description: 'Kit básico con fermentador de acero inoxidable, módulo IoT ESP32 y sensor de temperatura.',
    price:       12500,
    sku:         'NKA-KIT-001',
    stock:       15,
    rating:      4.5,
    image:       'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
    tags:        ['ESP32 dual', 'WiFi + BT', 'OTA updates', 'Código incluido'],
    category:    'Kits',
  },
  {
    id:          2,
    name:        'Kit Fermentador Nich-Ká Pro',
    description: 'Kit completo con 5 sensores, 2 módulos IoT y control de actuadores para instituciones avanzadas.',
    price:       18900,
    sku:         'NKA-KIT-002',
    stock:       8,
    rating:      4.8,
    image:       'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80',
    tags:        ['5 sensores', '2 módulos IoT', 'Actuadores', 'Detección anomalías'],
    category:    'Kits',
  },
  {
    id:          3,
    name:        'Sensor de pH de repuesto',
    description: 'Electrodo de vidrio combinado con compensación de temperatura automática. Diseñado para mediciones rápidas y estables en laboratorio y campo, con rango completo 0–14 pH.',
    price:       1200,
    sku:         'NKA-SEN-PH1',
    stock:       42,
    rating:      4.3,
    image:       'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&q=80',
    tags:        ['Compensación ATC', 'Rango 0–14 pH', 'Conector BNC', 'Certificado de fábrica'],
    category:    'Sensores',
    specs: [
      { label: 'Tipo de electrodo',          value: 'Vidrio combinado de un solo cuerpo' },
      { label: 'Rango de medición',           value: '0 – 14 pH'                         },
      { label: 'Precisión',                   value: '± 0.01 pH'                          },
      { label: 'Compensación de temperatura', value: 'Automática (ATC)'                   },
      { label: 'Temperatura de operación',    value: '0 – 80 °C'                          },
      { label: 'Conector',                    value: 'BNC estándar'                        },
      { label: 'Longitud de cable',           value: '1 m'                                },
      { label: 'Tiempo de respuesta',         value: '< 15 s'                             },
      { label: 'Material del cuerpo',         value: 'Vidrio borosilicato / epóxico'       },
      { label: 'Vida útil estimada',          value: '12 – 18 meses'                      },
    ],
    inclusions: [
      'Electrodo de pH NKA-SEN-PH1',
      'Capuchón de almacenamiento con solución KCl',
      'Guía rápida de calibración',
      'Certificado de calibración de fábrica',
    ],
    compatibility: 'Compatible con los medidores Nich-Ká de la serie NKA-MTR y la mayoría de equipos con entrada BNC.',
    reviewCount: 38,
    ratingDistribution: { 5: 72, 4: 19, 3: 6, 2: 2, 1: 1 },
    reviews: [
      {
        id: 1, name: 'Laura Méndez', initials: 'LM',
        institution: 'Lab. de calidad del agua',
        rating: 5, date: '12 abr 2026', verified: true,
        text: 'Lectura estable y respuesta rápida. La calibración a dos puntos quedó perfecta y el certificado de fábrica nos ahorró tiempo de validación.',
      },
      {
        id: 2, name: 'Carlos Ibáñez', initials: 'CI',
        institution: 'Acuicultura Nich-Ká',
        rating: 4, date: '28 mar 2026', verified: true,
        text: 'Buen reemplazo directo del electrodo anterior. El cable de 1 m se queda algo corto para mi montaje, pero el desempeño es excelente.',
      },
      {
        id: 3, name: 'Daniela Ortiz', initials: 'DO',
        institution: 'Universidad — Investigación',
        rating: 5, date: '05 mar 2026', verified: true,
        text: 'Precisión consistente entre mediciones. Lo usamos a diario con muestras a 40 °C y la compensación automática responde muy bien.',
      },
    ],
  },
  {
    id:          4,
    name:        'Sensor de temperatura de repuesto',
    description: 'Sonda de precisión ±0.1°C. Rango operativo 0°C a 80°C. Resistente a ácidos.',
    price:       850,
    sku:         'NKA-SEN-TMP',
    stock:       60,
    rating:      4.6,
    image:       'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
    tags:        ['Precisión ±0.1°C', 'Rango 0–80°C', 'Resistente a ácidos', 'Plug & Play'],
    category:    'Sensores',
  },
  {
    id:          5,
    name:        'Módulo IoT ESP32 de repuesto',
    description: 'Microcontrolador con WiFi y Bluetooth. Puente entre sensores y la plataforma Nich-Ká.',
    price:       650,
    sku:         'NKA-IOT-ESP32',
    stock:       0,
    rating:      4.4,
    image:       'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80',
    tags:        ['WiFi 802.11', 'Bluetooth 4.2', 'OTA updates', 'Firmware incluido'],
    category:    'Electrónica',
  },
  {
    id:          6,
    name:        'Licencia SaaS — Plan Starter (anual)',
    description: 'Acceso anual al plan Starter: 1 kit activo, hasta 5 docentes y estudiantes ilimitados.',
    price:       4999,
    sku:         'NKA-SAS-STR-A',
    stock:       999,
    tags:        ['1 kit activo', '5 docentes', 'Estudiantes ilimitados', 'NLP básico'],
    category:    'Software',
    rating:      4.7,
    image:       'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80',
  },
]

export class ProductRepositoryImpl implements ProductRepository {
  getAll(): Promise<Product[]> {
    return Promise.resolve(MOCK_PRODUCTS)
  }

  getById(id: number): Promise<Product> {
    const product = MOCK_PRODUCTS.find(p => p.id === id)
    if (!product) return Promise.reject(new Error('Producto no encontrado.'))
    return Promise.resolve(product)
  }
}
