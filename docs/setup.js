import * as Prefabs from "../docs/globals";

Object.keys(Prefabs).forEach(key => {
	global[key] = Prefabs[key];
});
