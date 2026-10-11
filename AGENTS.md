# Super Arthur World

## Objetivo e decisões do usuário

- Este é um experimento não comercial para testar a capacidade atual da IA de programar um clone mecânico de Super Mario World. Priorizar prevenção de bugs, comportamento correto e simplicidade; não introduzir expectativas enterprise, processos operacionais de produção ou complexidade excessiva.
- Projeto de treino de Spec Driven Development: entrevista de PRD, PRD e histórias, entrevista técnica, Techspec e contrato de testes, tasks, implementação por subagentes, revisão independente e correções por subagentes.
- Jogo de plataforma para navegador denominado Super Arthur World. Super Mario World (SNES) é a referência de escopo completo; não reduzir o escopo sem decisão explícita do usuário.
- O protagonista se chama Arthur. Usar pixel art 16 bits com cores contidas, sem uma apresentação colorida demais, em fantasia inspirada no Brasil com paisagens e criaturas reinterpretadas. Não presumir tema de terror ou sombrio a partir dessa preferência.
- Supabase é o banco de dados; Vercel é a hospedagem; GitHub é a integração de repositório.
- Somente um jogador. O usuário retirou explicitamente o modo de dois jogadores durante a entrevista; não implementar multiplayer local ou online. Os seis slots de save são de campanhas solo.
- Conversa em português. As skills pedem documentos formais em inglês; seguir essa regra até orientação diferente do usuário.

## Skills e execução

- As skills locais estão em `.agents/skills/`; sua origem está em `docs/compozy-skills.md`.
- Usar `cy-create-prd`, depois `cy-create-techspec`, depois `cy-create-tasks`. Respeitar as entrevistas, uma decisão por pergunta, e registrar respostas antes de escrever os documentos finais.
- Reutilizar as decisões já confirmadas. Não tratar sugestões ou alternativas como decisões aceitas.
- Executar o trabalho no Codex App com as ferramentas nativas de subagentes. Usar subagentes para implementar tasks e outros subagentes para revisar e corrigir, conforme solicitado.
- Compozy fornece apenas as skills e convenções documentais. Não instalar ou executar Compozy OS, CLI, loops, Herdr, agentes TUI ou roteadores de modelos. Referências a esses runtimes nas skills devem ser traduzidas para delegação nativa no Codex, preservando contratos, dependências, revisão e validação.
- Não adotar modelos específicos citados pelas skills do runtime original; usar o modelo herdado pelos subagentes do Codex.
- `.compozy/tasks/super-arthur-world/` é somente o diretório de artefatos: `_idea.md`, `_prd.md`, `_user_stories.md`, `_techspec.md`, `_tests.md`, ADRs, tasks e revisões.
- Não começar a implementação enquanto as entrevistas e os documentos de planejamento não estiverem concluídos e as tasks não estiverem prontas.
- Escolher o framework na Techspec com evidência atual e alternativas reais, considerando física, ferramentas de fases, controles, testes, desempenho no navegador e manutenção.
- Durante a Techspec, pesquisar repositórios open source com código pronto de qualidade para referência e possível reaproveitamento. Avaliar aderência das mecânicas, qualidade, testes, licença e compatibilidade com navegador; citar repositórios e revisões consultados. Não reinventar sistemas maduros sem motivo, nem importar uma arquitetura excessiva só porque existe em uma referência.
- Concentrar entrevistas nas decisões de produto e arquitetura com impacto real. Resolver detalhes rotineiros com julgamento técnico e registrar sua justificativa. Não reduzir o escopo confirmado para simplificar a implementação.
- Na entrevista da Techspec, usar linguagem leiga e compreensível para quem não sabe programação. Explicar escolhas pelo efeito no jogo e no esforço de implementação, traduzindo termos técnicos quando necessários. Recomendar frameworks consolidados e código validado, priorizando soluções simples. Não transferir ao usuário decisões técnicas rotineiras que o agente pode resolver com pesquisa e evidência.
- Após concluir o planejamento e as tasks, executar a implementação com o máximo de autonomia possível: delegar, validar, revisar, corrigir e repetir até concluir a publicação na Vercel. Uma revisão final por subagente de QA deve verificar a experiência completa e bloquear a publicação enquanto houver falhas relevantes não resolvidas. Após publicar, verificar o jogo na URL publicada.
- O usuário autorizou explicitamente commits, push, deploy e uso/configuração dos MCPs disponíveis ou necessários, em 2026-10-11. Essa autorização persiste; não solicitar nova confirmação para essas ações dentro do escopo do projeto. Respeitar eventuais barreiras reais de autenticação ou aprovação da plataforma, sem confundi-las com falta de autorização do usuário.

## Integrações

- Supabase, Vercel e GitHub foram autenticados e verificados por operações somente leitura em 2026-10-11.
- O usuário escolheu criar um projeto Supabase exclusivo para Super Arthur World; não usar o projeto Supabase preexistente para o jogo. A criação e o ID serão registrados na preparação do ambiente. Criar `super-arthur-world` no GitHub como repositório público, conforme escolha explícita do usuário. Criar hospedagem Vercel própria do jogo; não presumir que recursos existentes pertencem ao jogo.
- Usar as integrações conectadas para configurar os recursos e migrations após definir seus contratos. Não registrar tokens ou credenciais em documentos ou código.
