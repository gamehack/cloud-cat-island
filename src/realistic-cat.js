import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {clone as cloneSkeleton} from 'three/addons/utils/SkeletonUtils.js';
const loader=new GLTFLoader();
const cache=new Map();
const STATES={rest:['sleep','lie','rest','idle','sit'],walk:['walk','trot','run'],groom:['groom','lick','clean'],watch:['idle','look','sit']};
function getTemplate(url){if(!cache.has(url))cache.set(url,new Promise((resolve,reject)=>loader.load(url,resolve,undefined,reject)));return cache.get(url)}
export function pickClip(animations,state){const terms=STATES[state]||STATES.rest;for(const term of terms){const clip=animations.find(a=>a.name.toLowerCase().includes(term));if(clip)return clip}return animations[0]||null}
export async function attachRealisticCat({group,url,height=1.05}){if(!url||!url.startsWith('/models/cats/'))return null;const gltf=await getTemplate(url);const root=cloneSkeleton(gltf.scene);const box=new THREE.Box3().setFromObject(root),size=box.getSize(new THREE.Vector3());if(!Number.isFinite(size.y)||size.y<=0)throw Error('Invalid cat geometry');root.scale.multiplyScalar(height/size.y);root.updateMatrixWorld(true);const adjusted=new THREE.Box3().setFromObject(root);root.position.y-=adjusted.min.y;root.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});group.add(root);const mixer=gltf.animations.length?new THREE.AnimationMixer(root):null;let active=null;return {root,mixer,clips:gltf.animations,setState(state){if(!mixer)return;const clip=pickClip(gltf.animations,state);if(!clip||active?.getClip()===clip)return;const next=mixer.clipAction(clip);next.reset().fadeIn(.25).play();active?.fadeOut(.25);active=next},update(dt){mixer?.update(Math.min(dt,.1))}}}
