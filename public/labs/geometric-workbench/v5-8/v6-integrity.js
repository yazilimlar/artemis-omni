(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  else root.ARTEMIS_V6=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const APP_VERSION='6.0.0-alpha';
  const GEOMETRY_ENGINE_VERSION='artemis-geometry-5.8.0';
  const BOM_ENGINE_VERSION='artemis-bom-integrity-1.0.0-alpha';
  const PARSER_VERSION='artemis-constructor-parser-1.0.0';

  const BOM_ASSUMPTIONS=Object.freeze({
    memberLengthGroupingToleranceMm:1,
    bevelGroupingToleranceDeg:0.1,
    maxConnectionDeductionFraction:0.45,
    defaultWasteFactorPercent:10,
    topologyKeyMethod:'shared_source_index',
    topologyQuantizationTolerance:null
  });

  const CONNECTION_SYSTEMS=Object.freeze({
    piped:{label:'Piped hub-and-strut',assemblyModel:'shared_strut',interiorMembersPerEdge:1,boundaryMembersPerEdge:1,deductionModel:'proxy',verified:false},
    goodkarma:{label:'GoodKarma panel frame',assemblyModel:'panel_frame',interiorMembersPerEdge:2,boundaryMembersPerEdge:1,deductionModel:'proxy',verified:false},
    semicone:{label:'Semicone hub-and-strut',assemblyModel:'shared_strut',interiorMembersPerEdge:1,boundaryMembersPerEdge:1,deductionModel:'proxy',verified:false},
    cone:{label:'Cone hub-and-strut',assemblyModel:'shared_strut',interiorMembersPerEdge:1,boundaryMembersPerEdge:1,deductionModel:'proxy',verified:false},
    joint:{label:'Flush joint',assemblyModel:'shared_strut',interiorMembersPerEdge:1,boundaryMembersPerEdge:1,deductionModel:'proxy',verified:false}
  });

  const RIM_POLICIES=Object.freeze({
    member:{label:'Individual boundary members',multiplier:1},
    continuous_ring:{label:'Continuous rim / bottom plate',multiplier:0},
    excluded:{label:'Exclude from member BOM',multiplier:0}
  });

  const CONSTRUCTOR_TOKEN_SUPPORT=Object.freeze({
    domeFraction:{examples:['1/2','5/8','7/12'],support:'compatible',description:'Maps dome fraction to the Artemis cut-plane configuration.'},
    subdivisionMethod:{examples:['Kruschke','Mexican','Equal_Arcs','Equal_Chords'],support:'compatible',description:'Selects a supported Artemis subdivision method token. Renderer equivalence remains engine-dependent.'},
    frequency:{examples:['2V','3V','4V'],support:'compatible',description:'Sets supported subdivision frequency from 1V through 7V.'},
    radius:{examples:['R2.20','R3.00'],support:'compatible',description:'Interprets radius in metres and converts it to centimetres for the active Artemis model.'},
    beamSection:{examples:['beams_120x40'],support:'compatible',description:'Maps nominal rectangular member width and thickness.'},
    basePolyhedron:{examples:['Icosahedron','Octahedron','Octohedron','Tetrahedron'],support:'partial',description:'Selects an Artemis geometry family; spelling aliases are accepted, but subdivision equivalence varies by engine.'},
    classIII:{examples:['Class_III_1,2'],support:'partial',description:'Parses h,k notation. Geometric equivalence must be validated by the active Artemis geometry engine.'},
    connection:{examples:['GoodKarma','Semicone','Piped','Cone','Joint'],support:'partial',description:'Selects a preliminary Artemis connection profile. Current cut deductions are unvalidated proxies.'},
    fullerene:{examples:['Inscribed_Fulleren_on','Circumscribed_Fullerene'],support:'partial',description:'Carries a fullerene intent flag; complete geometric equivalence is not implemented for every geometry family.'},
    artemisExtensions:{examples:['rim_continuous','material_S355','pipewall_4','density_7850'],support:'artemis_extension',description:'Artemis-owned fabrication and boundary configuration tokens.'}
  });

  const CONSTRUCTOR_NOTATION_PRESETS=Object.freeze({
    kruschke:'7/12_Kruschke_GoodKarma_3V_R2.20_beams_120x40',
    octo:'Octohedron_1/2_Class_III_1,2_Inscribed_Fulleren_on_Semicone_3V_R2.20_beams_120x40'
  });

  function canonicalPair(a,b){return String(a)<String(b)?`${a}|${b}`:`${b}|${a}`;}
  function pointObject(p){return p?{x:Number(p.x)||0,y:Number(p.y)||0,z:Number(p.z)||0}:null;}
  function distance(a,b){if(!a||!b)return NaN;return Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z);}
  function migrationNotice(field){return `Legacy field ${field} was migrated to ${field==='acidomeHash'?'constructorNotation':'sourceNotation'}.`;}

  function migrateLegacyConstructorConfig(input={}){
    const migrated={...input};
    const notices=[],detected=[];
    let sourceFieldDetected=null;
    if(migrated.constructorNotation==null&&migrated.acidomeHash!=null){
      migrated.constructorNotation=migrated.acidomeHash;detected.push('acidomeHash');sourceFieldDetected='acidomeHash';
    }
    if(migrated.sourceNotation==null&&migrated.sourceHash!=null){
      migrated.sourceNotation=migrated.sourceHash;detected.push('sourceHash');sourceFieldDetected=sourceFieldDetected||'sourceHash';
    }
    if(detected.length)notices.push(detected.map(migrationNotice).join(' '));
    delete migrated.acidomeHash;
    delete migrated.sourceHash;
    return {config:migrated,notices,legacyCompatibility:sourceFieldDetected?{sourceFieldDetected,migrated:true}:null};
  }

  function tokenRecord(token,category,parsedValue,appliedField,support='compatible'){
    return {token,category,parsedValue,appliedField,support};
  }

  function parseConstructorNotation(sourceNotation=''){
    const source=String(sourceNotation||'').trim();
    const fragment=decodeURIComponent(source.includes('#')?source.split('#').pop():source);
    const normalized=fragment.replace(/[\s-]+/g,'_').replace(/_+/g,'_').replace(/^_|_$/g,'');
    const parts=normalized.split('_').filter(Boolean);
    const result={sourceNotation:source,normalizedNotation:normalized,recognizedTokens:[],partiallySupportedTokens:[],unsupportedTokens:[],ambiguousTokens:[],warnings:[],errors:[],appliedConfiguration:{},parserVersion:PARSER_VERSION};
    const add=(record)=>{
      if(record.support==='partial'||record.support==='deprecated') result.partiallySupportedTokens.push(record);
      else if(record.support==='ambiguous') result.ambiguousTokens.push(record);
      else if(record.support==='unsupported') result.unsupportedTokens.push(record);
      else result.recognizedTokens.push(record);
    };
    const set=(field,value,record)=>{result.appliedConfiguration[field]=value;add(record);};
    for(let i=0;i<parts.length;i+=1){
      const raw=parts[i], low=raw.toLowerCase(), next=(parts[i+1]||''), nextLow=next.toLowerCase();
      if(/^\d+\/\d+$/.test(raw)){
        const [a,b]=raw.split('/').map(Number);if(!b){result.errors.push(`Invalid dome fraction ${raw}.`);continue;}
        const fraction=a/b, unclamped=1-2*fraction, cutYR=Math.max(-0.25,Math.min(0.85,unclamped));
        set('domeFraction',raw,tokenRecord(raw,'domeFraction',raw,'domeFraction'));
        result.appliedConfiguration.cutYR=cutYR;
        if(cutYR!==unclamped)result.warnings.push(`Dome fraction ${raw} was clamped to the supported cut-plane range.`);
      }else if(['kruschke','mexican'].includes(low)){
        set('subdivisionMethod',low,tokenRecord(raw,'subdivisionMethod',low,'subdivisionMethod'));
      }else if(low==='equal'&&['arcs','chords'].includes(nextLow)){
        const value=`equal_${nextLow}`;set('subdivisionMethod',value,tokenRecord(`${raw}_${next}`,'subdivisionMethod',value,'subdivisionMethod'));i+=1;
      }else if(/^\d+v$/i.test(raw)){
        const requested=parseInt(raw,10),frequencyV=Math.max(1,Math.min(7,requested));
        set('frequencyV',frequencyV,tokenRecord(raw,'frequency',frequencyV,'frequencyV'));
        if(frequencyV!==requested)result.warnings.push(`Frequency ${raw} was clamped to the supported 1V–7V range.`);
      }else if(/^r\d+(?:\.\d+)?$/i.test(raw)){
        const radiusM=parseFloat(raw.slice(1));set('radiusM',radiusM,tokenRecord(raw,'radius',radiusM,'radiusM'));
        result.warnings.push(`Radius ${raw} was interpreted as ${radiusM.toFixed(2)} metres.`);
      }else if(/^beams?$/i.test(raw)&&/^\d+x\d+$/i.test(next)){
        const [beamWidthMm,beamThicknessMm]=next.toLowerCase().split('x').map(Number);
        result.appliedConfiguration.beamWidthMm=beamWidthMm;result.appliedConfiguration.beamThicknessMm=beamThicknessMm;
        add(tokenRecord(`${raw}_${next}`,'beamSection',{beamWidthMm,beamThicknessMm},'beamWidthMm/beamThicknessMm'));i+=1;
      }else if(low==='class'&&/^(i|ii|iii)$/i.test(next)){
        const subdivisionClass=next.toUpperCase();let combined=`${raw}_${next}`;
        result.appliedConfiguration.subdivisionClass=subdivisionClass;
        let support=subdivisionClass==='III'?'partial':'compatible';
        if(subdivisionClass==='III'&&/^\d+,\d+$/.test(parts[i+2]||'')){result.appliedConfiguration.hk=parts[i+2];combined+=`_${parts[i+2]}`;i+=1;}
        add(tokenRecord(combined,'subdivisionClass',{subdivisionClass,hk:result.appliedConfiguration.hk||null},'subdivisionClass/hk',support));i+=1;
        if(subdivisionClass==='III')result.warnings.push(`Class III ${result.appliedConfiguration.hk||'h,k'} was parsed, but equivalence with the source notation has not been independently validated.`);
      }else if(['goodkarma','semicone','piped','cone','joint'].includes(low)){
        set('connection',low,tokenRecord(raw,'connection',low,'connection','partial'));
        result.warnings.push(`${raw} was mapped to the preliminary Artemis ${CONNECTION_SYSTEMS[low].label} profile. Current connection deductions remain unvalidated.`);
      }else if(['icosahedron','icosa','octahedron','octohedron','tetrahedron','tetra'].includes(low)){
        const alias=low==='octohedron'?'octahedron':low;
        const canonical=alias.startsWith('octa')?'solid:Octahedron':alias.startsWith('tetra')?'solid:Tetrahedron':'icosahedron';
        set('basePolyhedron',canonical,tokenRecord(raw,'basePolyhedron',canonical,'basePolyhedron',low==='octohedron'?'deprecated':'partial'));
        if(low==='octohedron')result.warnings.push('Octohedron was accepted as a spelling alias for Octahedron.');
      }else if(['inscribed','circumscribed'].includes(low)&&/^fulleren(?:e)?$/i.test(next)){
        const mode=low,combined=`${raw}_${next}`;i+=1;
        set('fullerene',mode,tokenRecord(combined,'fullerene',mode,'fullerene','partial'));
        result.warnings.push(`${combined} was retained as constructor intent; complete fullerene equivalence is not implemented for every geometry family.`);
      }else if(low==='rim'&&['continuous','member','excluded'].includes(nextLow)){
        const rimPolicy=nextLow==='continuous'?'continuous_ring':nextLow;set('rimPolicy',rimPolicy,tokenRecord(`${raw}_${next}`,'artemisExtension',rimPolicy,'rimPolicy','artemis_extension'));i+=1;
      }else if(low==='material'&&next){
        set('material',next,tokenRecord(`${raw}_${next}`,'artemisExtension',next,'material','artemis_extension'));i+=1;
      }else if(low==='pipewall'&&/^\d+(?:\.\d+)?$/.test(next)){
        set('pipeWallThicknessMm',Number(next),tokenRecord(`${raw}_${next}`,'artemisExtension',Number(next),'pipeWallThicknessMm','artemis_extension'));i+=1;
      }else if(low==='density'&&/^\d+(?:\.\d+)?$/.test(next)){
        set('materialDensityKgM3',Number(next),tokenRecord(`${raw}_${next}`,'artemisExtension',Number(next),'materialDensityKgM3','artemis_extension'));i+=1;
      }else if(['pentad','cross','triad'].includes(low)){
        set('symmetry',low,tokenRecord(raw,'symmetry',low,'symmetry'));
      }else if(['clockwise','cw','ccw'].includes(low)){
        const spin=low==='clockwise'||low==='cw'?'cw':'ccw';set('spin',spin,tokenRecord(raw,'spin',spin,'spin'));
      }else if(low==='align'&&nextLow==='flat'){
        set('alignBase','flat',tokenRecord(`${raw}_${next}`,'alignBase','flat','alignBase'));i+=1;
      }else{
        const record=tokenRecord(raw,'unknown',null,null,'unsupported');add(record);result.warnings.push(`Unknown token ${raw} was not applied.`);
      }
    }
    return result;
  }

  function buildTopologyRegistry(input){
    const cells=Array.isArray(input)?input:(input&&input.cells)||[];
    const identityMethods=[...new Set(cells.map(c=>c.topologyIdentityMethod).filter(Boolean))];
    const registry={vertices:new Map(),edges:new Map(),faces:new Map(),metrics:{},warnings:[],failures:[],identityMethod:identityMethods.join('+')||BOM_ASSUMPTIONS.topologyKeyMethod,quantizationTolerance:null};
    const edgeLengthToleranceCm=1e-5;
    cells.forEach(cell=>{
      registry.faces.set(cell.id,{id:cell.id,edgeRefs:(cell.edgeRefs||[]).map(e=>e.canonicalKey)});
      const seen=new Set();
      (cell.edgeRefs||[]).forEach((ref,localIndex)=>{
        const a=ref.vertexAId,b=ref.vertexBId,key=ref.canonicalKey||canonicalPair(a,b);
        if(!a||!b){registry.failures.push(`Cell ${cell.id} edge ${localIndex} is missing endpoint IDs.`);return;}
        if(seen.has(key)){registry.failures.push(`Cell ${cell.id} contains duplicate local edge ${key}.`);return;}seen.add(key);
        const outerA=pointObject(ref.outerA),outerB=pointObject(ref.outerB),innerA=pointObject(ref.innerA),innerB=pointObject(ref.innerB);
        [[a,outerA],[b,outerB]].forEach(([id,position])=>{
          if(!registry.vertices.has(id))registry.vertices.set(id,{id,position,incidentEdgeIds:[],neighborVertexIds:[],incidentMemberDirections:[],neighboringCellIds:[],boundary:false});
          else if(position&&distance(registry.vertices.get(id).position,position)>edgeLengthToleranceCm)registry.failures.push(`Vertex identity collision for ${id}.`);
        });
        if(!registry.edges.has(key))registry.edges.set(key,{id:null,key,vertexAId:String(a)<String(b)?a:b,vertexBId:String(a)<String(b)?b:a,adjacentCellIds:[],adjacentLocalEdges:[],centerlineLengthCm:distance(outerA,outerB),outerLengthCm:distance(outerA,outerB),innerLengthCm:distance(innerA,innerB),boundary:false,manifoldClass:'unclassified',bevelSamples:[],dihedralSamples:[],ringRefs:[],zoneRefs:[]});
        const edge=registry.edges.get(key),sampleLength=distance(outerA,outerB);
        if(!Number.isFinite(sampleLength)||sampleLength<=1e-9)registry.failures.push(`Edge ${key} has zero or invalid length.`);
        if(Number.isFinite(sampleLength)&&Number.isFinite(edge.outerLengthCm)&&Math.abs(sampleLength-edge.outerLengthCm)>edgeLengthToleranceCm)registry.failures.push(`Edge ${key} has inconsistent adjacent lengths.`);
        edge.adjacentCellIds.push(cell.id);edge.adjacentLocalEdges.push({cellId:cell.id,localEdgeIndex:ref.localEdgeIndex==null?localIndex:ref.localEdgeIndex});
        const bevel=cell.bevels&&cell.bevels[localIndex];if(bevel){edge.bevelSamples.push(Number(bevel.sawBevel)||0);edge.dihedralSamples.push(Number(bevel.dihedral)||0);}
      });
    });
    [...registry.edges.values()].sort((a,b)=>a.key.localeCompare(b.key)).forEach((edge,index)=>{
      edge.id=`E-${String(index+1).padStart(6,'0')}`;
      const count=edge.adjacentCellIds.length;edge.boundary=count===1;edge.manifoldClass=count===1?'boundary':count===2?'interior':'nonmanifold';
      if(count>2)registry.failures.push(`Nonmanifold edge ${edge.id} has ${count} adjacent cells.`);
      [[edge.vertexAId,edge.vertexBId],[edge.vertexBId,edge.vertexAId]].forEach(([id,neighborId])=>{const vertex=registry.vertices.get(id),neighbor=registry.vertices.get(neighborId);if(!vertex||!neighbor){registry.failures.push(`Edge ${edge.id} references nonexistent vertex ${!vertex?id:neighborId}.`);return;}vertex.incidentEdgeIds.push(edge.id);vertex.neighborVertexIds.push(neighborId);const dx=neighbor.position.x-vertex.position.x,dy=neighbor.position.y-vertex.position.y,dz=neighbor.position.z-vertex.position.z,len=Math.hypot(dx,dy,dz)||1;vertex.incidentMemberDirections.push({edgeId:edge.id,x:dx/len,y:dy/len,z:dz/len});edge.adjacentCellIds.forEach(c=>{if(!vertex.neighboringCellIds.includes(c))vertex.neighboringCellIds.push(c);});if(edge.boundary)vertex.boundary=true;});
    });
    const boundaryEdges=[...registry.edges.values()].filter(e=>e.boundary),adj=new Map();
    boundaryEdges.forEach(e=>{[e.vertexAId,e.vertexBId].forEach(id=>{if(!adj.has(id))adj.set(id,[]);});adj.get(e.vertexAId).push(e.vertexBId);adj.get(e.vertexBId).push(e.vertexAId);});
    let boundaryLoops=0;const visited=new Set();
    for(const [id,neighbors] of adj){if(neighbors.length!==2)registry.failures.push(`Boundary vertex ${id} has boundary valence ${neighbors.length}; closed-loop classification failed.`);}
    for(const start of adj.keys()){if(visited.has(start))continue;boundaryLoops+=1;const stack=[start];while(stack.length){const id=stack.pop();if(visited.has(id))continue;visited.add(id);(adj.get(id)||[]).forEach(n=>{if(!visited.has(n))stack.push(n);});}}
    let surfaceComponents=0;const surfaceVisited=new Set();
    for(const start of registry.vertices.keys()){if(surfaceVisited.has(start))continue;surfaceComponents+=1;const stack=[start];while(stack.length){const id=stack.pop();if(surfaceVisited.has(id))continue;surfaceVisited.add(id);const vertex=registry.vertices.get(id);(vertex?.neighborVertexIds||[]).forEach(n=>{if(!surfaceVisited.has(n))stack.push(n);});}}
    const values=[...registry.edges.values()],V=registry.vertices.size,E=registry.edges.size,F=registry.faces.size,rawFaceEdgeSlots=cells.reduce((sum,c)=>sum+(c.edgeRefs||[]).length,0);
    registry.metrics={vertexCount:V,edgeCount:E,faceCount:F,rawFaceEdgeSlots,interiorEdgeCount:values.filter(e=>e.manifoldClass==='interior').length,boundaryEdgeCount:boundaryEdges.length,nonmanifoldEdgeCount:values.filter(e=>e.manifoldClass==='nonmanifold').length,boundaryLoopCount:boundaryLoops,surfaceComponentCount:surfaceComponents,eulerCharacteristic:V-E+F};
    registry.validation=validateTopology(registry);
    return registry;
  }

  function validateTopology(registry){
    const m=registry.metrics;
    let expected=null,expectedClass='unresolved';
    if(m.surfaceComponentCount!==1){expectedClass=`${m.surfaceComponentCount} disconnected surface components`;}
    else if(m.boundaryEdgeCount===0){expected=2;expectedClass='closed orientable genus-zero surface';}
    else if(m.boundaryLoopCount>0){expected=2-m.boundaryLoopCount;expectedClass=`connected orientable genus-zero surface with ${m.boundaryLoopCount} boundary loop(s)`;}
    let status=expected==null?'NOT EVALUATED':m.eulerCharacteristic===expected?'PASS':'FAIL';
    if(registry.failures.length)status='FAIL';else if(status==='PASS'&&registry.warnings.length)status='WARNING';
    return {status,expectedEulerCharacteristic:expected,expectedTopologyClass:expectedClass,genusAssumption:expected==null?null:0,warnings:[...registry.warnings],failures:[...registry.failures]};
  }

  function connectionDeductionCm(rawLenCm,profile,assumptions=BOM_ASSUMPTIONS){
    const w=(Number(profile.beamWidthMm)||0)/10,t=(Number(profile.beamThicknessMm)||0)/10,pipeR=(Number(profile.pipeDiaMm)||0)/20;
    let requestedDeductionCm=0,note='centerline reference; no deduction';
    switch(profile.connection){
      case 'piped':requestedDeductionCm=pipeR*2;note='pipe diameter subtraction proxy';break;
      case 'goodkarma':requestedDeductionCm=Math.max(w*.35,t*.55);note='panel-frame timber overlap proxy';break;
      case 'semicone':requestedDeductionCm=Math.max(w*.22+t*.18,1);note='semicone seat proxy';break;
      case 'cone':requestedDeductionCm=Math.max(w*.18,.8);note='conical flush reference proxy';break;
      case 'joint':requestedDeductionCm=Math.max(t*.2,.5);note='flush joint trim proxy';break;
    }
    const clampLimitCm=rawLenCm*assumptions.maxConnectionDeductionFraction,appliedDeductionCm=Math.min(clampLimitCm,requestedDeductionCm);
    return {requestedDeductionCm,appliedDeductionCm,clampLimitCm,deductionWasClamped:appliedDeductionCm<requestedDeductionCm,note};
  }

  function memberInstances(topology,profile,rimPolicyName='member'){
    const policy=CONNECTION_SYSTEMS[profile.connection]||CONNECTION_SYSTEMS.joint,rimPolicy=RIM_POLICIES[rimPolicyName]||RIM_POLICIES.member,instances=[];
    [...topology.edges.values()].forEach(edge=>{
      if(edge.manifoldClass==='nonmanifold')return;
      const multiplicity=edge.boundary?rimPolicy.multiplier:policy.interiorMembersPerEdge;
      for(let index=0;index<multiplicity;index+=1){
        const owner=edge.boundary?edge.adjacentLocalEdges[0]:(policy.assemblyModel==='panel_frame'?edge.adjacentLocalEdges[index]||edge.adjacentLocalEdges[0]:null);
        const deduction=connectionDeductionCm(edge.centerlineLengthCm,profile),bevel=edge.bevelSamples[index]??edge.bevelSamples[0]??0,dihedral=edge.dihedralSamples[index]??edge.dihedralSamples[0]??0;
        instances.push({instanceId:`MI-${String(instances.length+1).padStart(6,'0')}`,edgeId:edge.id,edgeClass:edge.manifoldClass,ownerCellId:owner?owner.cellId:null,ownerLocalEdge:owner?owner.localEdgeIndex:null,adjacentCellIds:[...edge.adjacentCellIds],centerlineLengthCm:edge.centerlineLengthCm,deductionCm:deduction.appliedDeductionCm,requestedDeductionCm:deduction.requestedDeductionCm,clampLimitCm:deduction.clampLimitCm,netCutLengthCm:Math.max(0,edge.centerlineLengthCm-deduction.appliedDeductionCm),sawBevelDeg:bevel,dihedralDeg:dihedral,connection:profile.connection,deductionNote:deduction.note,deductionWasClamped:deduction.deductionWasClamped,confidence:'unvalidated_proxy'});
      }
    });
    return instances;
  }

  function groupMemberInstances(instances,assumptions=BOM_ASSUMPTIONS){
    const map=new Map(),lengthStepCm=assumptions.memberLengthGroupingToleranceMm/10,bevelStep=assumptions.bevelGroupingToleranceDeg;
    instances.forEach(instance=>{
      const lengthGroup=Math.round(instance.netCutLengthCm/lengthStepCm)*lengthStepCm,bevelGroup=Math.round(instance.sawBevelDeg/bevelStep)*bevelStep,key=[lengthGroup.toFixed(4),bevelGroup.toFixed(4),instance.edgeClass,instance.connection].join('|');
      if(!map.has(key))map.set(key,{mark:null,qty:0,cutLen:lengthGroup,rawLen:instance.centerlineLengthCm,deduction:instance.deductionCm,requestedDeduction:instance.requestedDeductionCm,bevel:bevelGroup,dihedral:instance.dihedralDeg,connection:instance.connection,edgeClass:instance.edgeClass,note:instance.deductionNote,deductionWasClamped:false,ids:[],edgeIds:[]});
      const row=map.get(key);row.qty+=1;row.deductionWasClamped||=instance.deductionWasClamped;row.ids.push(instance.instanceId);row.edgeIds.push(instance.edgeId);
    });
    return [...map.values()].sort((a,b)=>a.cutLen-b.cutLen||a.bevel-b.bevel).map((row,index)=>({...row,mark:`M-${String(index+1).padStart(3,'0')}`}));
  }

  function hubSchedule(topology,connection){
    const groups=new Map();
    topology.vertices.forEach(vertex=>{const key=[vertex.incidentEdgeIds.length,vertex.boundary?'boundary':'interior',connection].join('|');if(!groups.has(key))groups.set(key,{mark:null,qty:0,valence:vertex.incidentEdgeIds.length,boundary:vertex.boundary,connection,vertexIds:[],warning:'Valence grouping is preliminary; angular configuration is not yet classified.'});const group=groups.get(key);group.qty+=1;group.vertexIds.push(vertex.id);});
    return [...groups.values()].sort((a,b)=>a.valence-b.valence||Number(a.boundary)-Number(b.boundary)).map((g,i)=>({...g,mark:`H-${String(i+1).padStart(3,'0')}`}));
  }

  function sectionProperties(profile){
    const family=profile.sectionFamily||(profile.connection==='piped'?'circular_hollow':'rectangular_solid');
    if(family==='circular_hollow'){
      const outerDiameterM=(Number(profile.pipeDiaMm)||0)/1000,wallM=(Number(profile.pipeWallThicknessMm)||0)/1000,innerDiameterM=Math.max(0,outerDiameterM-2*wallM);
      return {sectionFamily:family,sectionAreaM2:Math.PI/4*(outerDiameterM**2-innerDiameterM**2),description:`CHS Ø${profile.pipeDiaMm} × ${profile.pipeWallThicknessMm} mm wall`};
    }
    return {sectionFamily:'rectangular_solid',sectionAreaM2:((Number(profile.beamWidthMm)||0)/1000)*((Number(profile.beamThicknessMm)||0)/1000),description:`Rectangular solid ${profile.beamWidthMm} × ${profile.beamThicknessMm} mm`};
  }

  function canonicalStringify(value){
    if(value===null||typeof value!=='object')return JSON.stringify(value);
    if(Array.isArray(value))return `[${value.map(canonicalStringify).join(',')}]`;
    return `{${Object.keys(value).sort().filter(k=>value[k]!==undefined).map(k=>`${JSON.stringify(k)}:${canonicalStringify(value[k])}`).join(',')}}`;
  }

  async function sha256Hex(text){
    let cryptoApi=typeof globalThis!=='undefined'?globalThis.crypto:null;
    if((!cryptoApi||!cryptoApi.subtle)&&typeof require==='function')cryptoApi=require('node:crypto').webcrypto;
    if(!cryptoApi||!cryptoApi.subtle)throw new Error('Web Crypto SHA-256 is unavailable.');
    const bytes=new TextEncoder().encode(text),digest=await cryptoApi.subtle.digest('SHA-256',bytes);
    return [...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,'0')).join('');
  }
  async function configurationFingerprint(canonicalConfiguration){const canonicalJson=canonicalStringify(canonicalConfiguration),full=await sha256Hex(canonicalJson);return {full,abbreviated:full.slice(0,12),canonicalJson};}

  return {APP_VERSION,GEOMETRY_ENGINE_VERSION,BOM_ENGINE_VERSION,PARSER_VERSION,BOM_ASSUMPTIONS,CONNECTION_SYSTEMS,RIM_POLICIES,CONSTRUCTOR_TOKEN_SUPPORT,CONSTRUCTOR_NOTATION_PRESETS,canonicalPair,migrateLegacyConstructorConfig,parseConstructorNotation,buildTopologyRegistry,validateTopology,connectionDeductionCm,memberInstances,groupMemberInstances,hubSchedule,sectionProperties,canonicalStringify,configurationFingerprint};
});
