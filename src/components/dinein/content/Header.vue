<template>
  <div class="floor-section-wrap">
    <div class="floor-section">
      <ul class="ullist-floor">
        <li class="active"><a href="#">1st Floor</a></li>
        <li><a href="#">2nd Floor</a></li>
        <li><a href="#">Bar</a></li>
        <li><a href="#">Rooftop</a></li>
      </ul>
    </div>
    <div class="search-dine-table">
      <form class="form-inline search-inline">
        <div class="inner-addon left-addon">
          <img class="search-img" src="images/search-icon.png" alt="search" />
          <input type="text" class="form-control" placeholder="Search table" />
        </div>
      </form>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Header',
}
</script>
