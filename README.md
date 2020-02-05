# iotdb-query
Simple Database Query Functions


## New Grammar

This is a work in progress - ignore this for now

    and(
        eq(extract(:record, "schema:material"), "wikipedia:Gold"),
        gt(
            normalize(:record, "schema:weight, "unit:Gram"),
            100
        )
    )

        
