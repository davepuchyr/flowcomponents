exports.id = 'mergetoobject';
exports.title = 'Merge to object';
exports.group = 'Common';
exports.color = '#656D78';
exports.input = 2;
exports.click = true;
exports.output = 1;
exports.options = { props: [] };
exports.author = 'Martin Smola';
exports.icon = 'compress';

exports.html = `<div class="padding">
	<div data-jc="checkbox" data-jc-path="toobject">@(Merge data into object)</div>
	<br>
	<div data-jc="textboxlist" data-jc-path="props" data-maxlength="50" data-placeholder="property name" data-icon="fa-list">Properties</div>
	<div class="help">@(Data comming to each of the inputs will be assign to a property from top to bottom. The first input to the first property.)</div>
	<script>
		ON('save.mergetoobject', function(component, options) {
			if (options.props && options.props.length)
				component.input = options.props.length;
			else
				component.input = 0;
		});
	</script>
</div>`;

exports.readme = `# Merge to object
This component merges all received data into a \`Object\`. Clicking on the button will remove any previously recieved data.`;

exports.install = function(instance) {

	var data = {};

	instance.on('data', function(response) {

		var id = response.id;

		data[id] = data[id] || {};
		var prop = instance.options.props[response.index];
		if (!prop)
			instance.debug('No property name for current input:', response.index);
		else
			data[id][prop] = response.data;	

		instance.status(Object.keys(data[id]).join(', '), 'red');
		if (Object.keys(data[id]).length === instance.options.props.length) {
			response.data = data[id];
			instance.send(response);
			setTimeout2(instance.id, () => instance.status(''), 500, 10);
			data[id] = {};
		}
	});

	instance.on('click', function() {
		data = {};
	});
};