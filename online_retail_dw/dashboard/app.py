#!/usr/bin/env python3
"""UCI Online Retail电商销售数据仓库Streamlit展示页面。"""

from __future__ import annotations

from pathlib import Path

import pandas as pd
import streamlit as st


PROJECT_ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = PROJECT_ROOT / "data" / "output"

ADS_FILES = {
    "overview": "ads_sales_overview.csv",
    "daily": "ads_daily_sales_trend.csv",
    "monthly": "ads_monthly_sales_trend.csv",
    "product_sales": "ads_product_sales_top10.csv",
    "product_quantity": "ads_product_quantity_top10.csv",
    "country": "ads_country_sales_rank.csv",
    "customer": "ads_customer_sales_top10.csv",
    "hourly": "ads_hourly_order_distribution.csv",
    "quality": "ads_data_quality_report.csv",
}

NUMERIC_COLUMNS = {
    "valid_sales_record_count",
    "total_sales_amount",
    "total_order_count",
    "total_customer_count",
    "total_units_sold",
    "avg_order_value",
    "total_cancel_order_count",
    "total_cancel_amount",
    "unknown_customer_record_count",
    "sales_amount",
    "order_count",
    "customer_count",
    "product_count",
    "units_sold",
    "units_purchased",
    "sales_rank",
    "quantity_rank",
    "country_rank",
    "customer_rank",
    "invoice_hour",
    "metric_value",
}

QUALITY_LABELS = {
    "raw_record_count": "ODS原始记录",
    "duplicate_record_count": "完全重复记录",
    "valid_sales_record_count": "有效销售记录",
    "cancel_record_count": "去重取消记录",
    "raw_cancel_record_count": "原始取消记录",
    "invalid_record_count": "异常记录",
    "missing_customer_record_count": "客户编号缺失",
    "missing_description_record_count": "商品描述缺失",
    "non_positive_quantity_record_count": "非正数量",
    "non_positive_price_record_count": "非正单价",
    "invalid_date_record_count": "日期解析失败",
    "valid_record_rate": "有效销售记录率",
    "product_dimension_join_failure_count": "商品维度关联失败",
    "sales_amount_mismatch_count": "金额计算不一致",
    "dws_daily_amount_difference": "每日DWS金额差异",
    "dws_monthly_amount_difference": "每月DWS金额差异",
    "ads_overview_amount_difference": "ADS总览金额差异",
}


def format_money(value: float) -> str:
    return f"£{value:,.2f}"


def format_integer(value: float) -> str:
    return f"{int(round(value)):,}"


@st.cache_data(show_spinner=False)
def load_ads_data(data_dir: str) -> dict[str, pd.DataFrame]:
    base = Path(data_dir)
    missing = [name for name in ADS_FILES.values() if not (base / name).is_file()]
    if missing:
        raise FileNotFoundError(
            "缺少ADS导出文件："
            + ", ".join(missing)
            + "。请先运行 scripts/04_export_ads.py。"
        )

    frames: dict[str, pd.DataFrame] = {}
    for key, file_name in ADS_FILES.items():
        frame = pd.read_csv(base / file_name, keep_default_na=False)
        for column in frame.columns:
            if column in NUMERIC_COLUMNS:
                frame[column] = pd.to_numeric(frame[column], errors="raise")
        frames[key] = frame

    frames["daily"]["sales_date"] = pd.to_datetime(
        frames["daily"]["sales_date"], errors="raise"
    )
    return frames


def render_overview(data: dict[str, pd.DataFrame]) -> None:
    st.header("经营总览")
    row = data["overview"].iloc[0]

    first_row = st.columns(5)
    first_row[0].metric("总销售额（英镑）", format_money(row["total_sales_amount"]))
    first_row[1].metric("有效订单量", format_integer(row["total_order_count"]))
    first_row[2].metric("真实购买客户", format_integer(row["total_customer_count"]))
    first_row[3].metric("销售件数", format_integer(row["total_units_sold"]))
    first_row[4].metric("平均客单价", format_money(row["avg_order_value"]))

    second_row = st.columns(4)
    second_row[0].metric(
        "有效销售明细", format_integer(row["valid_sales_record_count"])
    )
    second_row[1].metric(
        "取消订单量", format_integer(row["total_cancel_order_count"])
    )
    second_row[2].metric("取消金额", format_money(row["total_cancel_amount"]))
    second_row[3].metric(
        "未知客户销售明细",
        format_integer(row["unknown_customer_record_count"]),
    )

    st.info(
        "销售指标只统计去重后的有效销售；客户数不包含UNKNOWN代理成员，"
        "但未知客户产生的合法销售仍计入销售额和订单量。"
    )


def render_trends(data: dict[str, pd.DataFrame]) -> None:
    st.header("销售趋势")
    daily = data["daily"].sort_values("sales_date")
    monthly = data["monthly"].sort_values("year_month")
    hourly = data["hourly"].sort_values("invoice_hour")

    st.subheader("每日销售额（英镑）")
    st.line_chart(
        daily,
        x="sales_date",
        y="sales_amount",
        x_label="交易日期",
        y_label="销售额（英镑）",
    )

    left, right = st.columns(2)
    with left:
        st.subheader("每月销售额（英镑）")
        st.bar_chart(
            monthly,
            x="year_month",
            y="sales_amount",
            x_label="月份",
            y_label="销售额（英镑）",
        )
    with right:
        st.subheader("每小时订单量")
        st.bar_chart(
            hourly,
            x="invoice_hour",
            y="order_count",
            x_label="小时",
            y_label="订单量",
        )

    st.caption(
        "趋势表只包含有有效销售的日期和小时；日期维度本身连续覆盖374天。"
    )


def product_label(frame: pd.DataFrame) -> pd.Series:
    return frame["stock_code"].astype(str) + " · " + frame["product_name"].str.slice(0, 28)


def render_products(data: dict[str, pd.DataFrame]) -> None:
    st.header("商品分析")
    sales = data["product_sales"].sort_values("sales_rank").copy()
    quantity = data["product_quantity"].sort_values("quantity_rank").copy()
    sales["商品"] = product_label(sales)
    quantity["商品"] = product_label(quantity)

    sales_tab, quantity_tab = st.tabs(["销售额TOP10", "销量TOP10"])
    with sales_tab:
        st.bar_chart(
            sales,
            x="商品",
            y="sales_amount",
            horizontal=True,
            x_label="销售额（英镑）",
            y_label="商品",
        )
        st.dataframe(
            sales[
                [
                    "sales_rank",
                    "stock_code",
                    "product_name",
                    "sales_amount",
                    "units_sold",
                    "order_count",
                ]
            ],
            width="stretch",
            hide_index=True,
        )
    with quantity_tab:
        st.bar_chart(
            quantity,
            x="商品",
            y="units_sold",
            horizontal=True,
            x_label="销售件数",
            y_label="商品",
        )
        st.dataframe(
            quantity[
                [
                    "quantity_rank",
                    "stock_code",
                    "product_name",
                    "units_sold",
                    "sales_amount",
                    "order_count",
                ]
            ],
            width="stretch",
            hide_index=True,
        )

    st.warning(
        "DOT、POST、M等特殊编号按项目规则保留，可能代表邮费或手工调整；"
        "商品排行展示编号与名称，便于答辩时解释。"
    )


def render_regions_and_customers(data: dict[str, pd.DataFrame]) -> None:
    st.header("地区与客户分析")
    country = data["country"].sort_values("country_rank").copy()
    customer = data["customer"].sort_values("customer_rank").copy()

    options = ["全部"] + country["country"].astype(str).tolist()
    selected = st.selectbox("国家或地区筛选", options)
    shown_country = country if selected == "全部" else country[country["country"] == selected]
    shown_customer = (
        customer if selected == "全部" else customer[customer["country"] == selected]
    )

    left, right = st.columns(2)
    with left:
        st.subheader("国家或地区销售排行")
        chart_country = shown_country.head(15)
        st.bar_chart(
            chart_country,
            x="country",
            y="sales_amount",
            horizontal=True,
            x_label="销售额（英镑）",
            y_label="国家或地区",
        )
        st.dataframe(shown_country, width="stretch", hide_index=True)
    with right:
        st.subheader("客户消费TOP10")
        if shown_customer.empty:
            st.info("当前筛选范围内没有进入全局TOP10的客户。")
        else:
            st.bar_chart(
                shown_customer,
                x="customer_id",
                y="sales_amount",
                horizontal=True,
                x_label="销售额（英镑）",
                y_label="客户编号",
            )
            st.dataframe(shown_customer, width="stretch", hide_index=True)
    st.caption("客户表是全局消费TOP10；国家筛选只在这10位客户中进行过滤。")


def quality_value(quality: pd.DataFrame, metric_name: str) -> float:
    match = quality.loc[quality["metric_name"] == metric_name, "metric_value"]
    if len(match) != 1:
        raise ValueError(f"质量指标缺失或重复：{metric_name}")
    return float(match.iloc[0])


def render_quality(data: dict[str, pd.DataFrame]) -> None:
    st.header("数据质量")
    quality = data["quality"].copy()

    first_row = st.columns(5)
    metrics = (
        ("raw_record_count", "ODS原始记录"),
        ("valid_sales_record_count", "有效销售记录"),
        ("cancel_record_count", "去重取消记录"),
        ("invalid_record_count", "异常记录"),
        ("duplicate_record_count", "完全重复记录"),
    )
    for column, (metric_name, label) in zip(first_row, metrics):
        column.metric(label, format_integer(quality_value(quality, metric_name)))

    second_row = st.columns(4)
    second_row[0].metric(
        "客户编号缺失",
        format_integer(quality_value(quality, "missing_customer_record_count")),
    )
    second_row[1].metric(
        "商品描述缺失",
        format_integer(quality_value(quality, "missing_description_record_count")),
    )
    second_row[2].metric(
        "有效销售记录率",
        f"{quality_value(quality, 'valid_record_rate'):.2%}",
    )
    second_row[3].metric(
        "ADS与DWD金额差异",
        format_money(quality_value(quality, "ads_overview_amount_difference")),
    )

    quality["指标"] = quality["metric_name"].map(QUALITY_LABELS).fillna(
        quality["metric_name"]
    )
    st.subheader("完整质量指标")
    st.dataframe(
        quality[["指标", "metric_value", "metric_unit"]],
        width="stretch",
        hide_index=True,
    )
    st.caption("各类质量记录可能相互重叠，不应直接相加作为异常总数。")


def main() -> None:
    st.set_page_config(
        page_title="UCI Online Retail电商销售分析",
        page_icon="🛍️",
        layout="wide",
    )
    st.title("UCI Online Retail 电商销售数据分析系统")
    st.caption("数据来源：UCI Online Retail｜数仓链路：HDFS → Hive ODS/DIM/DWD/DWS/ADS")

    try:
        data = load_ads_data(str(DATA_DIR))
    except (FileNotFoundError, ValueError) as exc:
        st.error(str(exc))
        st.stop()

    pages = {
        "经营总览": render_overview,
        "销售趋势": render_trends,
        "商品分析": render_products,
        "地区与客户分析": render_regions_and_customers,
        "数据质量": render_quality,
    }
    st.sidebar.title("功能导航")
    selected_page = st.sidebar.radio("选择页面", list(pages), key="selected_page")
    st.sidebar.caption("金额单位：英镑（GBP）")
    pages[selected_page](data)

    st.divider()
    st.caption("页面只读取ADS导出CSV，不在前端重复执行数据清洗。")


if __name__ == "__main__":
    main()

