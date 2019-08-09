<template>
    <div class="dinein-table-control">
        <div class="dinein-seat-available">
            <ul class="ullist-dinein-table">
                <li id="unavailable-seat"><span>3</span>Unavailable</li>
                <li id="available-seat"><span>4</span>Available</li>
                <li id="available-soon-seat"><span>3</span>Available Soon</li>
            </ul>
        </div>
        <div class="zoom-wrap-dinein">
            <div class="POSItemOptions_quantity_inputs">
                <!-- <input type='button' value='-' class='qtyminus value-qty' field='quantity'/> -->
                <button class="qtyminus value-qty">-</button>
                <input class="qty" min="1" name="quantity" type="text" value="100">
                <button class="qtyplus value-qty">+</button>
                <!-- <input type='button' value='+' class='qtyplus value-qty' field='quantity'/> -->
            </div>
            <div class="round-dinein-circle">
                                <span id="dine-top">
                                    <svg height="7" viewBox="0 0 14 7" width="14" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.304.264c.132.009.257.061.356.148l5.928 5.336a.598.598 0 0 1 .046.842.595.595 0 0 1-.842.042l-5.53-4.978-5.53 4.978a.595.595 0 1 1-.796-.884L6.864.412a.594.594 0 0 1 .44-.148z" fill="#3D3F43"
          fill-rule="evenodd"></path>
</svg>

</span><span id="dine-left"><svg height="14" viewBox="0 0 7 14" width="7" xmlns="http://www.w3.org/2000/svg">
    <path d="M.002 6.566c.008.132.06.258.148.357l5.335 5.928a.598.598 0 0 0 .843.045.595.595 0 0 0 .042-.842L1.39 6.524 6.37.995a.595.595 0 1 0-.885-.796L.15 6.126a.594.594 0 0 0-.148.44z" fill="#3D3F43"
          fill-rule="evenodd"></path>
</svg>
</span>
                <span id="dine-right"><svg height="14" viewBox="0 0 7 14" width="7"
                                           xmlns="http://www.w3.org/2000/svg">
    <path d="M6.522 6.566a.598.598 0 0 1-.148.357L1.04 12.85a.598.598 0 0 1-.843.045.595.595 0 0 1-.042-.842l4.979-5.53L.154.995A.595.595 0 1 1 1.04.199l5.335 5.928c.107.12.16.28.148.44z" fill="#3D3F43"
          fill-rule="evenodd"></path>
</svg>
</span>
                <span id="dine-bottom"><svg height="7" viewBox="0 0 14 7" width="14"
                                            xmlns="http://www.w3.org/2000/svg">
    <path d="M7.304 6.785a.598.598 0 0 0 .356-.148L13.588 1.3a.598.598 0 0 0 .046-.842.595.595 0 0 0-.842-.042l-5.53 4.979-5.53-4.98a.595.595 0 1 0-.796.885l5.928 5.336c.12.107.279.16.44.148z" fill="#3D3F43"
          fill-rule="evenodd"></path>
</svg>

</span>
                <div class="inner-round">
                    <div class="sub-inner-round"></div>
                </div>

            </div>

        </div>
    </div>
</template>

<script>
  export default {
    name: 'TableStatus'
  }
</script>