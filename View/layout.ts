export var layoutTemplate = `
    <html>
    <head>
        <link href="/assets/images/logo.png" rel="icon">
        <title>SerinusSoft</title>
        {head}
    </head>
    <body style="margin:0; overflow:hidden">
        {content}
        <script type="text/javascript">
         window.InitData = {script}
        </script>
        <script src="/assets/js/main.js"></script>
    </body>
    </html>
`;