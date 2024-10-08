<?php
include_once 'includes/database.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>iBoxing - Track Your Boxing Performance</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
</head>
<body>
    <header>
        <div class="navbar">
            <div class="logo">
                <h1><a href="index.php">iBoxing</a></h1>
            </div>
            <nav>
                <ul>
                    <li><a href="dashboard.php#login">Login</a></li>
                    <li><a href="#register">Register</a></li>
                    <li><a href="dashboard.php">Dashboard</a></li>
                    <li><a href="#community">Community</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <main>
        <section id="hero" style="background-image: url('https://i.pinimg.com/564x/06/07/8f/06078fd7d767c9cf623c25958f3f3cf4.jpg'); background-size: cover; background-position: center;">
            <div class="hero-content" style="display: flex; flex-direction: column; align-items: center;">
                <h2 style="display: inline;">Track Your Boxing Performance</h2>
                <p style="display: inline;">Join the iBoxing community and take your training to the next level.</p>
                <a href="#register" class="cta-button">Get Started</a>
            </div>
        </section>

        <section id="register" class="form-section">
            <h2>Register</h2>
            <form method="POST" action="includes/register.php">
                <input type="hidden" name="action" value="register">
                <label for="new-username">Username:</label>
                <input type="text" id="new-username" name="new-username" required>
                <button type="submit">Register</button>
            </form>
            <?php
                if (isset($_POST ['new-username'])) {
                    echo 'New Username: ' . htmlspecialchars($_POST['new-username']);
                }
            ?>
        </section>

        <section id="session-recording" class="form-section">
            <h2>Record Training Session</h2>
            <form method="POST" action="includes/record.php">
                <input type="hidden" name="action" value="record_session">
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" placeholder="Enter username" required>
                <label for="duration">Duration:</label>
                <input type="text" id="duration" name="duration" placeholder="Enter duration" required>
                <label for="max_distance">Max Distance:</label>
                <input type="text" id="max_distance" name="max_distance" placeholder="Enter max distance" required>
                <label for="highest_pitch">Highest Pitch:</label>
                <input type="text" id="highest_pitch" name="highest_pitch" placeholder="Enter highest pitch" required>
                <label for="hits_per_min">Hits Per Minute:</label>
                <input type="text" id="hits_per_min" name="hits_per_min" placeholder="Enter hits per minute" required>
                <label for="total_hits">Total Hits:</label>
                <input type="text" id="total_hits" name="total_hits" placeholder="Enter total hits" required>
                <button type="submit">Save Session</button>
            </form>
            <?php
                if (isset($_POST ['session-data'])) {
                    echo 'Session Data: ' . htmlspecialchars($_POST['session-data']);
                }
            ?>
        </section>
           <section id="community" class="content-section">
            <h2>Community</h2>
            <div id="community-forums">
            </div>
            <nav class="mobile-nav">
                <ul>
                    <li><a href="dashboard.php#login">Login</a></li>
                    <li><a href="#register">Register</a></li>
                    <li><a href="dashboard.php">Dashboard</a></li>
                    <li><a href="#community">Community</a></li>
                </ul>
            </nav>
        </section>
     
    </main>
    <footer>
        <div class="footer-content">
            <p>
                <a href="https://github.com/iBoxing"><i class="fab fa-github"></i> GitHub</a>
            </p>
        </div>
    </footer>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const nav = document.querySelector('.navbar nav');
            const mobileNav = document.querySelector('.mobile-nav');
            const applyStyles = () => {
                if (window.innerWidth <= 600) {
                    nav.style.display = 'none';
                    mobileNav.style.display = 'block';
                    mobileNav.style.backgroundColor = '#333';
                    mobileNav.style.padding = '10px 0';
                    const mobileNavUl = mobileNav.querySelector('ul');
                    mobileNavUl.style.listStyle = 'none';
                    mobileNavUl.style.margin = '20px 50px';
                    mobileNavUl.style.padding = '0';
                    mobileNavUl.style.textAlign = 'left';
                    const mobileNavLi = mobileNavUl.querySelectorAll('li');
                    mobileNavLi.forEach(li => {
                        li.style.margin = '10px 0';
                    });
                    const mobileNavA = mobileNavUl.querySelectorAll('a');
                    mobileNavA.forEach(a => {
                        a.style.color = '#fff';
                        a.style.textDecoration = 'none';
                        a.style.fontWeight = 'bold';
                    });
                } else {
                    nav.style.display = 'flex';
                    mobileNav.style.display = 'none';
                }
            };
            applyStyles();
            window.addEventListener('resize', applyStyles);
        });
    </script>
</body>
</html>
