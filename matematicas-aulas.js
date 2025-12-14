// Tab Navigation
document.addEventListener('DOMContentLoaded', function () {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            const targetTab = this.getAttribute('data-tab');

            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // Add active class to clicked button and corresponding pane
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // Viewer Modal
    const viewerModal = document.getElementById('viewer-modal');
    const closeViewerBtn = document.getElementById('close-viewer');
    const contentViewer = document.getElementById('content-viewer');
    const viewerTitle = document.getElementById('viewer-title');

    // Material Items (from Trabajo tab)
    const materialItems = document.querySelectorAll('.material-item');
    materialItems.forEach(item => {
        const viewBtn = item.querySelector('.material-view-btn');
        if (viewBtn) {
            viewBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                openViewer(item);
            });
        }

        item.addEventListener('click', function () {
            openViewer(item);
        });
    });

    function openViewer(element) {
        const url = element.getAttribute('data-url');
        const title = element.querySelector('.material-item-title, .material-title, .recording-title')?.textContent;

        if (url) {
            // Convert Google Drive view link to embed link
            let embedUrl = url;
            if (url.includes('drive.google.com')) {
                const fileId = extractGoogleDriveFileId(url);
                if (fileId) {
                    // Use the embed URL format for better compatibility
                    embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
                }
            }

            viewerTitle.textContent = title || 'Visualizador';
            contentViewer.src = embedUrl;
            viewerModal.classList.add('show');

            // Log for debugging
            console.log('Opening viewer with URL:', embedUrl);
        } else {
            alert('URL no disponible para este contenido');
        }
    }

    function extractGoogleDriveFileId(url) {
        // Extract file ID from various Google Drive URL formats
        const patterns = [
            /\/file\/d\/([^\/\?]+)/,
            /\/d\/([^\/\?]+)/,
            /id=([^&]+)/,
            /\/open\?id=([^&]+)/
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match && match[1]) {
                console.log('Extracted file ID:', match[1]);
                return match[1];
            }
        }
        console.log('Could not extract file ID from:', url);
        return null;
    }

    // Close Modal
    closeViewerBtn.addEventListener('click', function () {
        viewerModal.classList.remove('show');
        contentViewer.src = '';
    });

    // Close modal when clicking overlay
    const modalOverlay = document.querySelector('.modal-overlay');
    modalOverlay.addEventListener('click', function () {
        viewerModal.classList.remove('show');
        contentViewer.src = '';
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && viewerModal.classList.contains('show')) {
            viewerModal.classList.remove('show');
            contentViewer.src = '';
        }
    });

    // Add hover effects
    const cards = document.querySelectorAll('.material-card, .recording-card, .announcement-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transition = 'all 0.3s ease';
        });
    });

    // Collapse/Expand functionality for topic sections
    const topicHeaders = document.querySelectorAll('[data-toggle="collapse"]');
    topicHeaders.forEach(header => {
        header.addEventListener('click', function (e) {
            // Don't collapse if clicking on a material item
            if (e.target.closest('.material-item')) {
                return;
            }

            const topicSection = this.closest('.topic-section');
            topicSection.classList.toggle('collapsed');
        });
    });

    // Initialize all sections as collapsed except the first one
    const allTopicSections = document.querySelectorAll('.topic-section');
    allTopicSections.forEach((section, index) => {
        if (index > 0) {
            section.classList.add('collapsed');
        }
    });

    // Forum Discussion System
    const forumTopics = document.querySelectorAll('.forum-topic');
    const topicsList = document.getElementById('forum-topics-list');
    const topicDiscussion = document.getElementById('topic-discussion');
    const backToTopicsBtn = document.getElementById('back-to-topics');
    const discussionTitle = document.getElementById('discussion-title');
    const discussionMeta = document.getElementById('discussion-meta');
    const discussionPosts = document.getElementById('discussion-posts');

    // Forum data
    const forumData = {
        1: {
            title: '¿Cómo resolver ecuaciones cuadráticas?',
            author: 'María González',
            date: 'Hace 2 horas',
            content: 'Hola a todos, tengo dudas sobre el método de completar el cuadrado para resolver ecuaciones cuadráticas. ¿Alguien me podría explicar paso a paso cómo funciona? He visto varios videos pero aún no me queda claro.',
            replies: [
                {
                    author: 'Prof. Juan Pérez',
                    date: 'Hace 1 hora',
                    content: 'Hola María, el método de completar el cuadrado es muy útil. Te explico: Para una ecuación ax² + bx + c = 0, primero divides todo entre a, luego tomas el coeficiente de x (que sería b/a), lo divides entre 2 y lo elevas al cuadrado. Ese resultado lo sumas y restas en la ecuación.'
                },
                {
                    author: 'Carlos Ramírez',
                    date: 'Hace 45 min',
                    content: 'Yo también tuve problemas con esto al principio. Lo que me ayudó fue practicar con ejemplos simples primero, como x² + 6x + 5 = 0. ¿Quieres que resolvamos uno juntos?'
                },
                {
                    author: 'María González',
                    date: 'Hace 30 min',
                    content: '¡Sí por favor! Me ayudaría mucho ver un ejemplo paso a paso. Gracias a ambos por responder.'
                },
                {
                    author: 'Ana Martínez',
                    date: 'Hace 20 min',
                    content: 'También recomiendo ver el video de la clase 2 en materiales, ahí el profesor explica este método con varios ejemplos.'
                },
                {
                    author: 'Luis Torres',
                    date: 'Hace 10 min',
                    content: 'Yo hice un resumen con los pasos, si quieres te lo comparto María.'
                }
            ]
        },
        2: {
            title: 'Teorema de Pitágoras - Aplicaciones prácticas',
            author: 'Carlos Ramírez',
            date: 'Hace 5 horas',
            content: 'Hola compañeros, quiero compartir algunos ejercicios interesantes del teorema de Pitágoras que encontré. Son aplicaciones prácticas muy útiles para el ICFES. ¿Alguien más tiene ejercicios para compartir?',
            replies: [
                {
                    author: 'Sofia López',
                    date: 'Hace 4 horas',
                    content: 'Excelente Carlos! Yo tengo algunos problemas de distancias que usan Pitágoras. Los puedo subir si quieres.'
                },
                {
                    author: 'Diego Vargas',
                    date: 'Hace 3 horas',
                    content: 'Me interesan mucho. En el último simulacro me salieron varios de estos y no supe resolverlos bien.'
                }
            ]
        },
        3: {
            title: 'Preparación para el ICFES - Tips y estrategias',
            author: 'Ana Martínez',
            date: 'Hace 1 día',
            content: 'Hola a todos, quiero compartir algunas estrategias que me han funcionado para prepararme para el ICFES: 1) Hacer simulacros cronometrados, 2) Repasar las fórmulas clave cada día, 3) Resolver ejercicios de años anteriores. ¿Qué otras estrategias recomiendan?',
            replies: [
                {
                    author: 'María González',
                    date: 'Hace 20 horas',
                    content: 'Muy buenos tips Ana! Yo también recomiendo hacer grupos de estudio, me ha ayudado mucho.'
                },
                {
                    author: 'Prof. Laura Gómez',
                    date: 'Hace 18 horas',
                    content: 'Excelentes recomendaciones. También sugiero que identifiquen sus temas débiles y dediquen más tiempo a esos.'
                }
            ]
        }
    };

    forumTopics.forEach(topic => {
        topic.addEventListener('click', function () {
            const topicId = this.getAttribute('data-topic-id');
            const data = forumData[topicId];

            if (data) {
                // Update discussion view
                discussionTitle.textContent = data.title;
                discussionMeta.innerHTML = `
                    <span class="discussion-author">${data.author}</span>
                    <span class="discussion-date">${data.date}</span>
                `;

                // Build posts HTML
                let postsHTML = `
                    <div class="discussion-post original-post">
                        <div class="post-avatar">
                            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                        </div>
                        <div class="post-content">
                            <div class="post-header">
                                <span class="post-author">${data.author}</span>
                                <span class="post-date">${data.date}</span>
                            </div>
                            <p class="post-text">${data.content}</p>
                        </div>
                    </div>
                `;

                data.replies.forEach(reply => {
                    postsHTML += `
                        <div class="discussion-post reply-post">
                            <div class="post-avatar">
                                <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                </svg>
                            </div>
                            <div class="post-content">
                                <div class="post-header">
                                    <span class="post-author">${reply.author}</span>
                                    <span class="post-date">${reply.date}</span>
                                </div>
                                <p class="post-text">${reply.content}</p>
                            </div>
                        </div>
                    `;
                });

                discussionPosts.innerHTML = postsHTML;

                // Show discussion, hide topics list
                topicsList.style.display = 'none';
                topicDiscussion.style.display = 'block';
            }
        });
    });

    backToTopicsBtn.addEventListener('click', function () {
        topicDiscussion.style.display = 'none';
        topicsList.style.display = 'flex';
    });

    // Live Class Button
    const liveClassBtn = document.getElementById('live-class-btn');
    if (liveClassBtn) {
        liveClassBtn.addEventListener('click', function () {
            alert('La clase en vivo comenzará pronto. Te notificaremos cuando esté disponible.');
            // Aquí puedes agregar la lógica para abrir una sala de videoconferencia
            // Por ejemplo: window.open('URL_DE_ZOOM_O_MEET', '_blank');
        });
    }

    // Settings Button
    const settingsBtn = document.getElementById('settings-btn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', function () {
            alert('Configuración próximamente disponible.');
        });
    }
});
