/**
 * <!-- Sidebar -->
    <ul class="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion toggled" id="accordionSidebar">

        <!-- Divider -->
        <hr class="sidebar-divider d-none d-md-block">
        
        <!-- Heading -->
        <div class="sidebar-heading">
          Datasets
        </div>
  
        <!-- Nav Item - Pages Collapse Menu -->
        <li class="nav-item active">
          <a class="nav-link" href="#" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
            <i class="fa fa-database" aria-hidden="true"></i>
            <span>Asamblea nacional</span>
          </a>
          <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionSidebar">
            <div class="bg-white py-2 collapse-inner rounded">
              <h6 class="collapse-header">Periodos:</h6>
              <a class="collapse-item" >2017-2021</a>
              <a class="collapse-item active" onclick="handleDataset('1')" >2021-Presente</a>
            </div>
          </div>
        </li>
  
        <!-- Nav Item - Dashboard -->
        <li class="nav-item">
          <a class="nav-link" onclick="handleDataset('2')">
            <i class="fa fa-database" aria-hidden="true"></i>
            <span>Naciones Unidas</span></a>
        </li>

        <!-- Divider -->
        <hr class="sidebar-divider d-none d-md-block">
  
        <!-- Sidebar Toggler (Sidebar) -->
        <div class="text-center d-none d-md-inline">
          <button class="rounded-circle border-0" id="sidebarToggle"></button>
        </div>
  
      </ul>
      <!-- End of Sidebar -->
 */