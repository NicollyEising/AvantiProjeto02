// Importa o React e os hooks useState e useEffect
import React, { useState, useEffect } from "react";

// Importa o CSS do Bootstrap e os ícones do Bootstrap Icons
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// Componente funcional que representa o perfil do GitHub
const GitHubProfile = () => {
  // Estados para armazenar o nome digitado, nome de busca, dados do perfil e estado de carregamento
  const [username, setUsername] = useState(""); // Nome digitado pelo usuário
  const [searchUser, setSearchUser] = useState(""); // Nome efetivo para busca
  const [profileData, setProfileData] = useState(null); // Dados retornados da API
  const [loading, setLoading] = useState(false); // Indicador de carregamento

  // Efeito colateral executado sempre que o valor de searchUser for alterado
  useEffect(() => {
    if (!searchUser) return; // Se não houver usuário para buscar, encerra

    // Função assíncrona que busca os dados do usuário na API do GitHub
    const fetchProfileData = async () => {
      setLoading(true); // Define que a busca está em andamento
      try {
        const response = await fetch(
          `https://api.github.com/users/${searchUser}` // Chamada à API do GitHub
        );
        const data = await response.json();

        // Verifica se o usuário não foi encontrado
        if (data.message === "Not Found") {
          throw new Error("Usuário não encontrado");
        }

        // Atualiza o estado com os dados obtidos
        setProfileData(data);
      } catch (error) {
        console.error("Erro ao buscar perfil:", error);
        setProfileData(null); // Reseta os dados do perfil
      } finally {
        setLoading(false); // Finaliza o carregamento
      }
    };

    // Executa a função de busca
    fetchProfileData();
  }, [searchUser]);

  // Função que lida com o envio do formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim() !== "") {
      setSearchUser(username.trim());
    }
  };

  // html
  return (
    <div>
      {/* Elementos de fundo visuais */}
      <div className="radial"></div>
      <div className="halftone"></div>
      <div className="radial-2"></div>

      <div className="container mt-4">
        {/* Barra de navegação com formulário de busca */}
        <nav className="navbar mb-4">
          <div className="container overlay">
            <form
              className="search-box w-100"
              role="search"
              onSubmit={handleSubmit} // Define função ao enviar o formulário
            >
              {/* Título da aplicação */}
              <h1 className="text-white title">
                <i className="fa-brands fa-github"></i> Perfil{" "}
                <strong>GitHub</strong>
              </h1>

              {/* Campo de entrada e botão de pesquisa */}
              <div className="search-input-group">
                <input
                  className="form-control"
                  type="search"
                  placeholder="Digite um usuário do GitHub"
                  aria-label="Search"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <button className="btn btn-outline-success" type="submit">
                  <i className="bi bi-search"></i>
                </button>
              </div>

              {/* Icone de carregamento */}
              {loading && (
                <div className="mt-3">
                  <div
                    className="loader text-white"
                    style={{ marginTop: "50px" }}
                  ></div>
                </div>
              )}

              {/* Exibição dos dados do perfil, caso encontrado */}
              {!loading && profileData && (
                <div className="text-center mt-3 profile">
                  <img
                    src={profileData.avatar_url}
                    alt={profileData.name}
                    width="150"
                  />
                  <div className="profile-container">
                    <div className="profile-text">
                      <h5>{profileData.name}</h5>
                      <p>{profileData.bio}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Mensagem de erro se não encontrar perfil */}
              {!loading && searchUser && !profileData && (
                <div className="mt-3 notFound">
                  Nenhum perfil foi encontrado com esse nome de usuário. <br />
                  Tente novamente
                </div>
              )}
            </form>
          </div>
        </nav>
      </div>
    </div>
  );
};

// Exporta o componente para uso externo
export default GitHubProfile;
