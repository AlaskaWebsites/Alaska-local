// scripts/new-demo.js
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')

const args = process.argv.slice(2)
const slug = String(args[0] || '').trim()
const name = String(args || 'Novo Estabelecimento').trim()
const phone = String(args || '11999999999').trim()

if (!slug) {
  console.log('❌ Uso: node scripts/new-demo.js <slug> "<Nome>" "<Telefone>"')
  console.log('Exemplo: node scripts/new-demo.js pizzaria-napolitana "Pizzaria Napolitana" "11987654321"')
  process.exit(1)
}

const templatePath = path.join(rootDir, 'data', 'hamburgueria-x.json')
const newPath = path.join(rootDir, 'data', `${slug}.json`)

if (fs.existsSync(newPath)) {
  console.log(`⚠️ A demo "${slug}.json" já existe em data/!`)
  process.exit(0)
}

if (!fs.existsSync(templatePath)) {
  console.log(`❌ Template base não encontrado em: ${templatePath}`)
  process.exit(1)
}

const templateData = JSON.parse(fs.readFileSync(templatePath, 'utf-8'))
templateData.slug = slug
templateData.name = name
templateData.phoneWhatsApp = phone.replace(/\D/g, '')

fs.writeFileSync(newPath, JSON.stringify(templateData, null, 2), 'utf-8')
console.log(`✅ Nova demo criada com sucesso: data/${slug}.json`)
console.log(`🔗 Acesse em: http://localhost:3000/${slug}`)