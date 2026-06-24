import Header from '../components/Header';

function ComingSoonPage( { pageName }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <Header />
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
                flexDirection: 'column',
                gap: '0.5rem',
                color: '#a0a0b0',
            }}>
                <h2 style={{ color: '#e0e0e0', fontSize: '1.4rem' }}>{pageName}</h2>
                <p>This page is coming soon.</p>
            </div>
        </div>
    );
}

export default ComingSoonPage;