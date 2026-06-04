import React, { useState } from "react";
import { Hash, Calendar, User, Info, FileText, Plus, Trash2, Award, Wrench, Video, Cable } from "lucide-react";
import { jsPDF } from "jspdf";
import jspdfAutoTable from "jspdf-autotable"; // Importação renomeada

export default function App() {
  // --- LOGO EM BASE64 DA YUNG CFTV ---
  const logoBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAABGAQMAAAB6v6pFAAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlMAQObYZgAAAAlwSFlzAAAOxAAADsQBlssOGwAAAThJREFUeNrtl70OgyAQhZ8GB8bEnZg4MPEBvAnvwpD6ALwJ78bEnZg4MHFgMOnfSgNptbYm6tBwXwIhcnIu98MFAmEYhmGYt2YidK6yU9V5C46+6xQYpZlZ1WvLshz6VtcYpUXW7K4W7C0m81vLsmSIsi80K9Yg06z4R9b1Y7gMizVstXIsMizisDqY76eAofvC7h/DMoGg68XOfBlWD6vXmO+nwNByGZat6157eXmIsc99/XvLshR7m6bZ6WFYvU0C6/owHFsIsZqZbdWZZZkO06Fvddf6LMXMrux967PUw5pZZVmmY+h9ZpVVlr7VrPZIsZis+FvN3mL/yr6FYYUewzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAMwzAM8y/mE6E8bK+8mF7FAAAAAElFTkSuQmCC";

  // --- ESTADOS DO APLICATIVO ---
  const [numeroOrcamento, setNumeroOrcamento] = useState("001/2026");
  const [dataEmissao, setDataEmissao] = useState("2026-06-03");
  const [validade, setValidade] = useState("15 dias");

  const [cliente, setCliente] = useState({
    nome: "CALCÁRIO ITATINGA",
    cidade: "Castro-PR",
    contato: "",
    telefone: ""
  });

  const [servicos, setServicos] = useState([
    { id: 1, descricao: "Troca DVR balança", quantidade: 1, valor: 200 },
    { id: 2, descricao: "Configuração sistema de câmeras (computador / gravação)", quantidade: 1, valor: 200 },
    { id: 3, descricao: "Configuração sistema câmeras (almox)", quantidade: 1, valor: 100 },
    { id: 4, descricao: "Configuração sistema câmeras (escritório)", quantidade: 1, valor: 180 },
    { id: 5, descricao: "1ª manutenção câmeras paiol", quantidade: 1, valor: 280 },
    { id: 6, descricao: "2ª manutenção câmeras paiol", quantidade: 1, valor: 220 },
    { id: 7, descricao: "3ª manutenção câmeras paiol", quantidade: 1, valor: 240 }
  ]);

  const [materiais, setMateriais] = useState([
    { id: 1, descricao: "DVR 3008 Intelbras / linha 1000", quantidade: 1, valor: 1150 }
  ]);

  const [observacoes, setObservacoes] = useState(
    "• Garantia conforme condições do fabricante.\n• Valores sujeitos à alteração conforme necessidade técnica.\nOrçamento válido por 7 dias."
  );

  // --- CÁLCULOS DE TOTAIS ---
  const totalServicos = servicos.reduce((acc, curr) => acc + (Number(curr.quantidade) * Number(curr.valor)), 0);
  const totalMateriais = materiais.reduce((acc, curr) => acc + (Number(curr.quantidade) * Number(curr.valor)), 0);
  const totalGeral = totalServicos + totalMateriais;

  // --- MANIPULAÇÃO DE SERVIÇOS ---
  const adicionarServico = () => {
    setServicos([...servicos, { id: Date.now(), descricao: "", quantidade: 1, valor: 0 }]);
  };

  const removerServico = (id) => {
    setServicos(servicos.filter(item => item.id !== id));
  };

  const atualizarServico = (id, campo, valor) => {
    setServicos(servicos.map(item => item.id === id ? { ...item, [campo]: valor } : item));
  };

  // --- MANIPULAÇÃO DE MATERIAIS ---
  const adicionarMaterial = () => {
    setMateriais([...materiais, { id: Date.now(), descricao: "", quantidade: 1, valor: 0 }]);
  };

  const removerMaterial = (id) => {
    setMateriais(materiais.filter(item => item.id !== id));
  };

  const atualizarMaterial = (id, campo, valor) => {
    setMateriais(materiais.map(item => item.id === id ? { ...item, [campo]: valor } : item));
  };

  // --- FORMATAÇÃO MONETÁRIA BR ---
  const formatBRL = (valor) =>
    Number(valor).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // --- FUNÇÃO DE GERAÇÃO DO PDF ---
  const gerarPDF = () => {
    try {
      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      // Cabeçalho Principal Azul Escuro
      doc.setFillColor(11, 25, 44);
      doc.rect(0, 0, 210, 42, "F");

      // Renderizar Logomarca
      try {
        doc.addImage(logoBase64, "PNG", 15, 8, 38, 13);
      } catch (e) {
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.text("YUNG CFTV", 15, 18);
      }

      // Detalhes da Empresa
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.text("SEGURANÇA ELETRÔNICA & MONITORAMENTO", 15, 25);
      doc.text("CNPJ: 63.807.635/0001-15 | RUA TEOFILO DE CASTRO, 10A - SOCAVAO - CASTRO/PR", 15, 30);
      doc.text("Contato WhatsApp: (42) 99821-9550 | 'Que Deus nos abençoe sempre'", 15, 35);

      // Faixa de Destaque Azul Ciano
      doc.setFillColor(0, 141, 218);
      doc.rect(0, 42, 210, 1.5, "F");

      // Informações do Orçamento
      doc.setTextColor(11, 25, 44);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(`Orçamento: ${numeroOrcamento}`, 15, 54);

      doc.setFontSize(9.5);
      doc.setFont("helvetica", "normal");
      doc.text(`DATA: ${dataEmissao.split('-').reverse().join('/')}`, 195, 51, { align: "right" });
      doc.text(`Validade da Proposta: ${validade}`, 195, 56, { align: "right" });

      // Container de Informações do Cliente
      doc.setFillColor(245, 247, 250);
      doc.rect(15, 62, 180, 24, "F");
      doc.setDrawColor(210, 215, 222);
      doc.rect(15, 62, 180, 24, "S");

      doc.setFont("helvetica", "bold");
      doc.text(`Cliente: ${cliente.nome.toUpperCase()}`, 20, 68);
      doc.text(`Cidade: ${cliente.cidade}`, 20, 77);
      doc.setFont("helvetica", "normal");
      doc.text(`Contato: ${cliente.contato || "---"}`, 125, 68);
      doc.text(`Telefone: ${cliente.telefone || "---"}`, 125, 77);

      // Tabela 1: Mão de Obra / Serviços
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(11, 25, 44);
      doc.text("1. MANUTENÇÕES / PRESTAÇÃO DE SERVIÇOS", 15, 95);

      const colunasServicos = ["Item", "Descrição do Serviço Executado", "Qtd", "Valor Unit.", "Total"];
      const linhasServicos = servicos.map((s, i) => [
        i + 1, s.descricao, s.quantidade, `R$ ${formatBRL(s.valor)}`, `R$ ${formatBRL(s.quantidade * s.valor)}`
      ]);

      jspdfAutoTable(doc, {
        startY: 98,
        head: [colunasServicos],
        body: linhasServicos,
        theme: "striped",
        headStyles: { fillColor: [11, 25, 44], textColor: [255, 255, 255] },
        styles: { fontSize: 8.5 },
        columnStyles: { 0: { halign: "center", cellWidth: 10 }, 2: { halign: "center", cellWidth: 12 }, 3: { halign: "right", cellWidth: 25 }, 4: { halign: "right", cellWidth: 25 } }
      });

      let currentY = doc.lastAutoTable.finalY + 8;

      // Tabela 2: Materiais / Equipamentos
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(11, 25, 44);
      doc.text("2. MATERIAL USADO / EQUIPAMENTOS", 15, currentY);

      const colunasMateriais = ["Item", "Descrição do Equipamento", "Qtd", "Valor Unit.", "Total"];
      const linhasMateriais = materiais.map((m, i) => [
        i + 1, m.descricao, m.quantidade, `R$ ${formatBRL(m.valor)}`, `R$ ${formatBRL(m.quantidade * m.valor)}`
      ]);

      jspdfAutoTable(doc, {
        startY: currentY + 3,
        head: [colunasMateriais],
        body: linhasMateriais,
        theme: "striped",
        headStyles: { fillColor: [45, 55, 72], textColor: [255, 255, 255] },
        styles: { fontSize: 8.5 },
        columnStyles: { 0: { halign: "center", cellWidth: 10 }, 2: { halign: "center", cellWidth: 12 }, 3: { halign: "right", cellWidth: 25 }, 4: { halign: "right", cellWidth: 25 } }
      });

      currentY = doc.lastAutoTable.finalY + 10;

      if (currentY > 230) {
        doc.addPage();
        currentY = 20;
      }

      // Bloco de Observações
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(210, 215, 222);
      doc.rect(15, currentY, 110, 30, "FD");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(11, 25, 44);
      doc.text("OBSERVAÇÕES:", 18, currentY + 5);
      doc.setFont("helvetica", "normal");
      const quebraTexto = doc.splitTextToSize(observacoes, 104);
      doc.text(quebraTexto, 18, currentY + 11);

      // Bloco de Valores Totais
      doc.setFillColor(245, 247, 250);
      doc.rect(132, currentY, 63, 30, "F");
      doc.rect(132, currentY, 63, 30, "S");

      doc.setFontSize(8.5);
      doc.setTextColor(11, 25, 44);
      doc.text(`Mão de Obra: R$ ${formatBRL(totalServicos)}`, 136, currentY + 7);
      doc.text(`Equipamentos: R$ ${formatBRL(totalMateriais)}`, 136, currentY + 14);

      doc.setDrawColor(11, 25, 44);
      doc.line(132, currentY + 19, 195, currentY + 19);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(`TOTAL GERAL: R$ ${formatBRL(totalGeral)}`, 136, currentY + 25);

      // Rodapé
      doc.setDrawColor(180, 180, 180);
      doc.line(55, 274, 155, 274);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text("YUNG CFTV - Responsável Técnico", 105, 279, { align: "center" });

      doc.save(`Orcamento_${numeroOrcamento.replace("/", "_")}_YungCFTV.pdf`);
    } catch (err) {
      alert("Erro ao gerar PDF: " + err.message);
    }
  };

  const estilos = {
    corpo: { fontFamily: "'Segoe UI', Roboto, sans-serif", backgroundColor: "#0b1329", minHeight: "100vh", color: "#f8fafc", padding: "30px 15px" },
    painel: { maxWidth: "950px", margin: "0 auto", backgroundColor: "#1c2541", borderRadius: "10px", border: "1px solid rgba(59, 130, 246, 0.2)", overflow: "hidden", boxShadow: "0 15px 30px rgba(0,0,0,0.4)" },
    topo: { background: "linear-gradient(135deg, #0b1329, #1c2541)", padding: "25px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "3px solid #008dda" },
    blocoCampos: { display: "flex", gap: "15px", padding: "20px", backgroundColor: "rgba(11, 19, 41, 0.25)", flexWrap: "wrap" },
    caixaInput: { flex: "1 1 200px", display: "flex", flexDirection: "column" },
    rotulo: { fontSize: "11px", color: "#64748b", fontWeight: "bold", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: "4px" },
    campoText: { backgroundColor: "#0b1329", border: "1px solid #334155", borderRadius: "6px", padding: "10px", color: "#fff", fontSize: "13px" },
    areaTabela: { padding: "20px", borderBottom: "1px solid #1e293b" },
    itemFlex: { display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" },
    btnNovaLinha: { backgroundColor: "#1d4ed8", color: "#fff", border: "none", borderRadius: "5px", padding: "6px 12px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" },
    btnExcluir: { backgroundColor: "transparent", color: "#ef4444", border: "none", cursor: "pointer", display: "flex", alignItems: "center" },
    btnFim: { backgroundColor: "#10b981", color: "#fff", border: "none", borderRadius: "8px", padding: "14px", width: "100%", fontSize: "15px", fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 12px rgba(16,185,129,0.3)", display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }
  };

  return (
    <div style={estilos.corpo}>
      <div style={estilos.painel}>

        {/* CABEÇALHO */}
        <div style={estilos.topo}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            <img
              src={`${import.meta.env.BASE_URL}image_a11a54.png`}
              alt="YUNG CFTV Logo"
              style={{ height: "60px", width: "auto", borderRadius: "8px" }}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <h2 style={{ margin: 0, fontSize: "22px", fontWeight: "bold", color: "#fff", letterSpacing: "1px" }}>
                YUNG <span style={{ color: "#008dda" }}>CFTV</span>
              </h2>
              <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Sistemas de Segurança Profissional
              </p>
            </div>
          </div>
          <div style={{ textAlign: "right", fontSize: "12px", color: "#64748b", fontFamily: "monospace", lineHeight: "1.4" }}>
            <div style={{ fontWeight: "bold", color: "#94a3b8" }}>CNPJ: 63.807.635/0001-15</div>
            <div>Rua Teófilo de Castro, 10A - Socavão</div>
            <div>Castro - PR</div>
          </div>
        </div>

        {/* METADADOS */}
        <div style={estilos.blocoCampos}>
          <div style={estilos.caixaInput}>
            <label style={estilos.rotulo}><Hash size={12}/> Nº Orçamento</label>
            <input type="text" style={estilos.campoText} value={numeroOrcamento} onChange={(e) => setNumeroOrcamento(e.target.value)} />
          </div>
          <div style={estilos.caixaInput}>
            <label style={estilos.rotulo}><Calendar size={12}/> Emissão</label>
            <input type="date" style={estilos.campoText} value={dataEmissao} onChange={(e) => setDataEmissao(e.target.value)} />
          </div>
          <div style={estilos.caixaInput}>
            <label style={estilos.rotulo}><Award size={12}/> Validade</label>
            <input type="text" style={estilos.campoText} value={validade} onChange={(e) => setValidade(e.target.value)} />
          </div>
        </div>

        {/* CLIENTE */}
        <div style={estilos.areaTabela}>
          <h3 style={{ fontSize: "13px", color: "#60a5fa", margin: "0 0 15px 0", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "6px" }}><User size={14}/> Identificação do Cliente</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
            <input type="text" placeholder="Nome do Cliente" style={estilos.campoText} value={cliente.nome} onChange={(e) => setCliente({...cliente, nome: e.target.value})} />
            <input type="text" placeholder="Cidade" style={estilos.campoText} value={cliente.cidade} onChange={(e) => setCliente({...cliente, cidade: e.target.value})} />
            <input type="text" placeholder="Contato" style={estilos.campoText} value={cliente.contato} onChange={(e) => setCliente({...cliente, contato: e.target.value})} />
            <input type="text" placeholder="Telefone" style={estilos.campoText} value={cliente.telefone} onChange={(e) => setCliente({...cliente, telefone: e.target.value})} />
          </div>
        </div>

        {/* SERVIÇOS */}
        <div style={estilos.areaTabela}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
            <h3 style={{ fontSize: "13px", color: "#60a5fa", margin: 0, textTransform: "uppercase", display: "flex", alignItems: "center", gap: "6px" }}><Wrench size={14}/> 1. Mão de Obra e Serviços</h3>
            <button onClick={adicionarServico} style={estilos.btnNovaLinha}><Plus size={12} style={{ marginRight: "4px", verticalAlign: "middle" }}/> Adicionar Serviço</button>
          </div>
          {servicos.map((item) => (
            <div key={item.id} style={estilos.itemFlex}>
              <input type="text" style={{ ...estilos.campoText, flex: 1 }} value={item.descricao} onChange={(e) => atualizarServico(item.id, "descricao", e.target.value)} />
              <input type="number" style={{ ...estilos.campoText, width: "70px", textAlign: "center" }} value={item.quantidade} onChange={(e) => atualizarServico(item.id, "quantidade", parseInt(e.target.value) || 0)} />
              <input type="number" style={{ ...estilos.campoText, width: "110px", textAlign: "right" }} value={item.valor} onChange={(e) => atualizarServico(item.id, "valor", parseFloat(e.target.value) || 0)} />
              <button onClick={() => removerServico(item.id)} style={estilos.btnExcluir}><Trash2 size={15}/></button>
            </div>
          ))}
        </div>

        {/* MATERIAIS */}
        <div style={estilos.areaTabela}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
            <h3 style={{ fontSize: "13px", color: "#38bdf8", margin: 0, textTransform: "uppercase", display: "flex", alignItems: "center", gap: "6px" }}><Video size={14}/> 2. Equipamentos e Materiais</h3>
            <button onClick={adicionarMaterial} style={{ ...estilos.btnNovaLinha, backgroundColor: "#0284c7" }}><Plus size={12} style={{ marginRight: "4px", verticalAlign: "middle" }}/> Adicionar Insumo</button>
          </div>
          {materiais.map((item) => (
            <div key={item.id} style={estilos.itemFlex}>
              <input type="text" style={{ ...estilos.campoText, flex: 1 }} value={item.descricao} onChange={(e) => atualizarMaterial(item.id, "descricao", e.target.value)} />
              <input type="number" style={{ ...estilos.campoText, width: "70px", textAlign: "center" }} value={item.quantidade} onChange={(e) => atualizarMaterial(item.id, "quantidade", parseInt(e.target.value) || 0)} />
              <input type="number" style={{ ...estilos.campoText, width: "110px", textAlign: "right" }} value={item.valor} onChange={(e) => atualizarMaterial(item.id, "valor", parseFloat(e.target.value) || 0)} />
              <button onClick={() => removerMaterial(item.id)} style={estilos.btnExcluir}><Trash2 size={15}/></button>
            </div>
          ))}
        </div>

        {/* RESUMO */}
        <div style={{ padding: "20px", display: "flex", flexWrap: "wrap", gap: "20px" }}>
          <div style={{ flex: "1 1 400px" }}>
            <label style={estilos.rotulo}><Info size={12}/> Cláusulas e Observações</label>
            <textarea rows={3} style={{ ...estilos.campoText, width: "100%", resize: "none" }} value={observacoes} onChange={(e) => setObservacoes(e.target.value)} />
          </div>
          <div style={{ flex: "1 1 250px", backgroundColor: "#0b1329", padding: "15px", borderRadius: "6px", border: "1px solid #334155", textAlign: "right", alignSelf: "flex-end" }}>
            <div style={{ color: "#64748b", fontSize: "13px" }}>Serviços: R$ {totalServicos.toFixed(2)}</div>
            <div style={{ color: "#64748b", fontSize: "13px", margin: "4px 0 10px 0" }}>Equipamentos: R$ {totalMateriais.toFixed(2)}</div>
            <div style={{ fontSize: "18px", fontWeight: "bold", color: "#10b981", borderTop: "1px solid #1c2541", paddingTop: "8px" }}>
              TOTAL: R$ {totalGeral.toFixed(2)}
            </div>
          </div>
        </div>

        {/* EMISSÃO */}
        <div style={{ padding: "0 20px 20px 20px" }}>
          <button onClick={gerarPDF} style={estilos.btnFim}>
            <FileText size={16} /> EMITIR ORÇAMENTO TIMBRADO (PDF)
          </button>
        </div>

      </div>
    </div>
  );
}
