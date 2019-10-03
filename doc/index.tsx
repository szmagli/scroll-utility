export default (modules: string[] = []) => (
	/* "!DOCTYPE html\n" + */
	<html>
		<head>
			<title>Hello World</title>
		</head>
		<body>
			<h1>Hello World</h1>
			{modules.map(file => (
				<script type="text/javascript" src={file} />
			))}
		</body>
	</html>
);
