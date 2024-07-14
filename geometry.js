class GeomUtils{
    static EPS = 1e-6;
    
    static signedArea(p0,p1,p2){
        /*
                |p0.x p0.y 1|
        1/2 det |p1.x p1.y 1|
                |p2.x p2.y 1|
        */

        return (p0.x*p1.y+p0.y*p2.x+p1.x*p2.y-p2.x*p1.y-p2.y*p0.x-p1.x*p0.y);
    }


    /* Based on https://stackoverflow.com/questions/25385361/point-within-a-triangle-barycentric-co-ordinates */

    

    /* p,p0,p1 and p2 are Point2d  */
    static insideTriangle(p,p0,p1,p2){
        var res = false;
        var areap0p1p2,areapp1p2,areap0pp2;
        areap0p1p2 = GeomUtils.signedArea(p0,p1,p2);
        areapp1p2  = GeomUtils.signedArea(p,p1,p2);
        areap0pp2  = GeomUtils.signedArea(p0,p,p2);

        var l0 = areapp1p2/areap0p1p2;
        var l1 = areap0pp2/areap0p1p2;
        var l2 = 1-l0-l1;

        if (((p0.x == p.x) & (p0.y == p.y)) | ((p1.x == p.x) & (p2.y == p.y)) | ((p2.x == p.x) & (p2.y == p.y))){
            res = true;
        } 
        else if ((l0 == 0) | (l1 == 0) | (l2 == 0)){
            res = true;
        }
        else if (( (0 < l0) & (l0 < 1)) & ((0 < l1) & (l1 < 1)) & ((0 < l2) & (l2 < 1))){
            res =  true;
        }

        return res;
    }

    static computeCenter(obj){
	 
        if (obj !== undefined){
          var vertices = obj.vertices;
          
          var min_x = vertices[0];
          var max_x = vertices[0];
          
          var min_y = vertices[1];
          var max_y = vertices[1];
          
          var min_z = vertices[2];
          var max_z = vertices[2];
          
          var i, n = vertices.length;
          for (i=3;i<n;i+=3){
            min_x = Math.min(min_x, vertices[i]); 
            min_y = Math.min(min_y, vertices[i+1]);
            min_z = Math.min(min_z, vertices[i+2]); 
            
            max_x = Math.max(max_x, vertices[i]); 
            max_y = Math.max(max_y, vertices[i+1]);
            max_z = Math.max(max_z, vertices[i+2]); 
          }
    
          obj.center = [(min_x+max_x)/2.0,(min_y+max_y)/2.0,(min_z+max_z)/2.0];
    
          //obj.center[0] = (min_x+max_x)/2.0;
          //obj.center[1] = (min_y+max_y)/2.0;
          //obj.center[2] = (min_z+max_z)/2.0;
    
          }
      }
    
}


