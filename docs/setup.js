import * as Prefabs from "../docs/globals";
import ScrollUtility from "../src";

Object.keys(Prefabs).forEach(key => {
	global[key] = Prefabs[key];
});

global.ScrollUtility = ScrollUtility;
