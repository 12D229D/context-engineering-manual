/*
 * Manual y Guía de Ingeniería de Contexto - Script Principal
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavigation();
    initSearch();
    initCodeCopy();
    initProgressTracking();
    initWizard();
    initMobileMenu();
    initContextPlayground();
});

/* ==========================================================================
   1. Theme Management (Dark / Light Mode)
   ========================================================================== */
function initTheme() {
    const themeBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');

    const savedTheme = localStorage.getItem('context_guide_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeUI(savedTheme);

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('context_guide_theme', newTheme);
            updateThemeUI(newTheme);
        });
    }

    function updateThemeUI(theme) {
        if (themeIcon && themeText) {
            if (theme === 'dark') {
                themeIcon.textContent = '🌙';
                themeText.textContent = 'Modo Oscuro';
            } else {
                themeIcon.textContent = '☀️';
                themeText.textContent = 'Modo Claro';
            }
        }
    }
}

/* ==========================================================================
   2. Navigation & SPA Routing via Hash
   ========================================================================== */
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.doc-section');
    const currentCrumb = document.getElementById('current-crumb');

    function activateSection(targetId, updateHash = true) {
        if (!targetId) targetId = 'inicio';

        // Hide all sections, remove active class
        sections.forEach(sec => sec.classList.remove('active'));
        navItems.forEach(item => item.classList.remove('active'));

        const targetSection = document.getElementById(targetId);
        const targetNavItem = document.querySelector(`.nav-item[data-target="${targetId}"]`);

        if (targetSection) {
            targetSection.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });

            if (targetNavItem) {
                targetNavItem.classList.add('active');
                if (currentCrumb) {
                    currentCrumb.textContent = targetNavItem.querySelector('.nav-text')?.textContent || targetId;
                }
            }

            if (updateHash) {
                history.pushState(null, null, `#${targetId}`);
            }

            // Track reading progress
            saveProgress(targetId);
        }
    }

    // Nav click handlers
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const target = item.getAttribute('data-target');
            activateSection(target);

            // Close mobile menu if open
            document.querySelector('.sidebar')?.classList.remove('mobile-open');
        });
    });

    // Handle back/forward & direct links
    window.addEventListener('popstate', () => {
        const hash = window.location.hash.replace('#', '');
        activateSection(hash || 'inicio', false);
    });

    // Initial load check
    const initialHash = window.location.hash.replace('#', '');
    if (initialHash) {
        activateSection(initialHash, false);
    } else {
        activateSection('inicio', false);
    }
}

/* ==========================================================================
   3. Real-time Search Filter
   ========================================================================== */
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const navGroups = document.querySelectorAll('.nav-group');
    const navItems = document.querySelectorAll('.nav-item');

    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();

        navItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            const matches = text.includes(query);
            item.style.display = matches ? 'flex' : 'none';
        });

        // Hide empty nav groups
        navGroups.forEach(group => {
            const visibleChildren = group.querySelectorAll('.nav-item[style*="display: flex"], .nav-item:not([style*="display"])');
            const hasVisible = Array.from(visibleChildren).some(child => child.style.display !== 'none');
            group.style.display = hasVisible ? 'block' : 'none';
        });
    });
}

/* ==========================================================================
   4. Code Copy to Clipboard
   ========================================================================== */
function initCodeCopy() {
    const copyBtns = document.querySelectorAll('.copy-btn');

    copyBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const wrapper = btn.closest('.code-wrapper');
            const codeBlock = wrapper ? wrapper.querySelector('code') : null;

            if (codeBlock) {
                try {
                    await navigator.clipboard.writeText(codeBlock.innerText);
                    const originalText = btn.innerHTML;
                    btn.innerHTML = '✓ ¡Copiado!';
                    btn.style.backgroundColor = 'var(--accent-emerald)';
                    btn.style.color = '#fff';

                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.style.backgroundColor = '';
                        btn.style.color = '';
                    }, 2000);
                } catch (err) {
                    btn.textContent = '❌ Error';
                }
            }
        });
    });
}

/* ==========================================================================
   5. Reading Progress Tracking
   ========================================================================== */
const TOTAL_SECTIONS = 6;

function saveProgress(sectionId) {
    if (sectionId === 'inicio') return;

    let readSections = JSON.parse(localStorage.getItem('context_read_sections')) || [];
    if (!readSections.includes(sectionId)) {
        readSections.push(sectionId);
        localStorage.setItem('context_read_sections', JSON.stringify(readSections));
    }
    updateProgressUI(readSections);
}

function initProgressTracking() {
    const readSections = JSON.parse(localStorage.getItem('context_read_sections')) || [];
    updateProgressUI(readSections);

    // Manual completion buttons inside sections
    const completionBtns = document.querySelectorAll('.completion-btn');
    completionBtns.forEach(btn => {
        const sectionId = btn.getAttribute('data-section');
        if (readSections.includes(sectionId)) {
            setBtnCompleted(btn);
        }

        btn.addEventListener('click', () => {
            let currentRead = JSON.parse(localStorage.getItem('context_read_sections')) || [];
            if (!currentRead.includes(sectionId)) {
                currentRead.push(sectionId);
                localStorage.setItem('context_read_sections', JSON.stringify(currentRead));
                setBtnCompleted(btn);
                updateProgressUI(currentRead);
            }
        });
    });
}

function setBtnCompleted(btn) {
    btn.classList.add('completed');
    btn.innerHTML = '✓ Sección Leída y Completada';
}

function updateProgressUI(readSections) {
    const valElem = document.getElementById('progress-val');
    const fillElem = document.getElementById('progress-fill');

    if (valElem && fillElem) {
        const percent = Math.min(Math.round((readSections.length / TOTAL_SECTIONS) * 100), 100);
        valElem.textContent = `${percent}%`;
        fillElem.style.width = `${percent}%`;
    }
}

/* ==========================================================================
   6. Interactive Decision Wizard (Context Playground)
   ========================================================================== */
const CONTEXT_DATASETS = {
    general: {
        name: "Contexto General",
        description: "Contexto amplio y general que cubre múltiples áreas temáticas.",
        useCase: "Ideal para tareas que requieren conocimiento general y amplio.",
        pros: "Cubre una amplia gama de temas, útil para tareas generales.",
        cons: "Puede incluir información irrelevante para tareas específicas."
    },
    especifico: {
        name: "Contexto Específico",
        description: "Contexto enfocado en un área temática específica.",
        useCase: "Ideal para tareas que requieren conocimiento especializado en un área específica.",
        pros: "Información relevante y específica, útil para tareas especializadas.",
        cons: "Puede faltar información relevante para otras áreas."
    },
    historico: {
        name: "Contexto Histórico",
        description: "Contexto que incluye información histórica y contextual.",
        useCase: "Ideal para tareas que requieren conocimiento histórico y contextual.",
        pros: "Información histórica y contextual, útil para tareas que requieren conocimiento histórico.",
        cons: "Puede incluir información irrelevante para tareas actuales."
    }
};

function initContextPlayground() {
    const selector = document.getElementById('context-selector');
    const loadBtn = document.getElementById('load-context-btn');
    const render = document.getElementById('context-render');

    if (!selector || !loadBtn || !render) return;

    loadBtn.addEventListener('click', () => {
        const key = selector.value;
        const context = CONTEXT_DATASETS[key];
        if (!context) {
            render.innerHTML = '<p class="context-render-empty">Contexto no encontrado.</p>';
            return;
        }

        render.innerHTML = `
            <div class="context-card" style="width:100%;">
                <h3 style="color: var(--accent-cyan); margin-bottom: 1rem; font-size: 1.3rem; font-weight: 800;">
                    🔬 ${context.name}
                </h3>
                <div style="margin-bottom: 1.25rem;">
                    <div style="font-size: 0.8rem; color: var(--accent-cyan); font-weight: 700; text-transform: uppercase; margin-bottom: 0.3rem;">Descripción</div>
                    <p style="color: var(--text-secondary); font-size: 0.92rem; margin: 0;">${context.description}</p>
                </div>
                <div style="margin-bottom: 1.25rem;">
                    <div style="font-size: 0.8rem; color: var(--accent-cyan); font-weight: 700; text-transform: uppercase; margin-bottom: 0.3rem;">Caso de Uso</div>
                    <p style="color: var(--text-secondary); font-size: 0.92rem; margin: 0;">${context.useCase}</p>
                </div>
                <div style="margin-bottom: 1.25rem;">
                    <div style="font-size: 0.8rem; color: var(--accent-emerald); font-weight: 700; text-transform: uppercase; margin-bottom: 0.3rem;">Ventajas</div>
                    <p style="color: var(--text-secondary); font-size: 0.92rem; margin: 0;">${context.pros}</p>
                </div>
                <div>
                    <div style="font-size: 0.8rem; color: var(--accent-rose); font-weight: 700; text-transform: uppercase; margin-bottom: 0.3rem;">Desventajas</div>
                    <p style="color: var(--text-secondary); font-size: 0.92rem; margin: 0;">${context.cons}</p>
                </div>
            </div>
        `;
    });
}

/* ==========================================================================
   7. Mobile Navigation Drawer
   ========================================================================== */
function initMobileMenu() {
    const toggleBtn = document.getElementById('mobile-toggle-btn');
    const sidebar = document.querySelector('.sidebar');

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('mobile-open');
        });
    }
}
