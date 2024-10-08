<?php
include_once 'includes/database.php';
session_start(); // Ensure session is started
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
                    <li><a href="#login">Login</a></li>
                    <li><a href="index.php#register">Register</a></li>
                    <li><a href="dashboard.php">Dashboard</a></li>
                    <li><a href="index.php#community">Community</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <main>
        <section id="dashboard" class="content-section">
            <h2>Dashboard</h2>
            <div id="dashboard-content">
                <section id="login" class="form-section">
                    <h2>Login</h2>
                        <form method="POST" action="includes/login.php">
                            <input type="hidden" name="action" value="login">
                            <label for="username">Username:</label>
                            <input type="text" id="username" name="username" required>
                            <button type="submit">Login</button>
                        </form>
                        <?php
                            if (isset($_POST ['username'])) {
                                echo 'Username: ' . htmlspecialchars($_POST['username']);
                            }
                        ?>
                </section>
            </div>
            <?php if (isset($_SESSION['user_id'])): ?>
            <div id="chart-container">FusionCharts will render here</div>
                    <script src="https://code.jquery.com/jquery-2.2.4.js" integrity="sha256-iT6Q9iMJYuQiMWNd9lDyBUStIq/8PuOW33aOqmvFpqI="
                        crossorigin="anonymous"></script>
                    <script src="js/FusionCharts.js"></script>
                    <script src="js/fusioncharts.charts.js"></script>
                    <script src="js/fusioncharts.theme.zune.js"></script>
                    <script src="js/app.js"></script>
                    <script>
                        document.addEventListener('DOMContentLoaded', function() {
                            // Show the chart container only when logged in
                            const chartContainer = document.getElementById('chart-container');
                            chartContainer.style.display = 'block';
                            // Initialize the chart here if needed
                        });
                    </script>
            <?php endif; ?>
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
            const logo = document.querySelector('.navbar .logo');
            const applyStyles = () => {
                if (window.innerWidth <= 600) {
                    nav.style.display = 'none';
                    logo.style.textAlign = 'center';
                } else {
                    nav.style.display = 'flex';
                    logo.style.textAlign = 'left';
                }
            };
            applyStyles();
            window.addEventListener('resize', applyStyles);
        });
    </script>
</body>

</html>
