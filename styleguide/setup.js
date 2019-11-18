import * as Prefabs from "../docs/components/globals";

Object.keys(Prefabs).forEach(key => {
	global[key] = Prefabs[key];
});
